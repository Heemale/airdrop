module airdrop::invest {

    use sui::event;
    use sui::vec_map::{Self, VecMap};

    // === Struct ===

    // 投资对象
    public struct Invest has key, store {
        id: UID,
        // 总投资金额
        total_investment: VecMap<address, u64>,
        // 总收益金额
        total_gains: VecMap<address, u64>,
        // 最新一次投资金额
        last_investment: VecMap<address, u64>,
        // 最近一次收益累计金额
        last_accumulated_gains: VecMap<address, u64>,
    }

    // === Event ===

    public struct UpdateInvest has copy, drop {
        // 用户
        address: address,
        // 数量
        amount: u64,
        // 是否增加
        is_increase: bool,
        // 总投资金额
        total_investment: u64,
    }

    public struct UpdateGains has copy, drop {
        // 用户
        address: address,
        // 数量
        amount: u64,
        // 是否增加
        is_increase: bool,
        // 总收益金额
        total_gains: u64,
    }

    public(package) fun new(ctx: &mut TxContext) {
        let invest = Invest {
            id: object::new(ctx),
            total_investment: vec_map::empty(),
            total_gains: vec_map::empty(),
            last_investment: vec_map::empty(),
            last_accumulated_gains: vec_map::empty(),
        };
        transfer::public_share_object(invest);
    }

    /*
     * @notice 修改投资对象investment数据
     */
    public(package) fun modify(
        self: &mut Invest,
        address: address,
        fix_total_investment: u64,
        fix_total_gains: u64,
        fix_last_investment: u64,
        fix_accumulated_gains: u64,
    ): bool {
        // 总投资金额
        let is_exists = self.total_investment.contains(&address);

        let (amount, is_increase, total_investment) = if (is_exists) {
            let total_investment = *self.total_investment.get(&address);

            let is_increase = fix_total_investment > total_investment;
            let amount = if (is_increase) {
                fix_total_investment - total_investment
            } else {
                total_investment - fix_total_investment
            };
            self.total_investment.remove(&address);

            (amount, is_increase, total_investment)
        } else {
            (fix_total_investment, true, fix_total_investment)
        };
        self.total_investment.insert(address, fix_total_investment);

        // 最新一次投资金额
        let is_exists = self.last_investment.contains(&address);
        if (is_exists) {
            self.last_investment.remove(&address);
        };
        self.last_investment.insert(address, fix_last_investment);

        event::emit(UpdateInvest {
            address,
            amount,
            is_increase,
            total_investment,
        });

        // 总收益金额
        let is_exists = self.total_gains.contains(&address);
        let (amount, is_increase, total_gains) = if (is_exists) {
            let total_gains = *self.total_gains.get(&address);

            let is_increase = fix_total_gains > total_gains;
            let amount = if (is_increase) {
                fix_total_gains - total_gains
            } else {
                total_gains - fix_total_gains
            };
            self.total_gains.remove(&address);

            (amount, is_increase, total_gains)
        } else {
            (fix_total_gains, true, fix_total_gains)
        };
        self.total_gains.insert(address, fix_total_gains);

        // 最近一次收益累计金额
        let is_exists = self.last_accumulated_gains.contains(&address);
        if (is_exists) {
            self.last_accumulated_gains.remove(&address);
        };
        self.last_accumulated_gains.insert(address, fix_accumulated_gains);

        event::emit(UpdateGains {
            address,
            amount,
            is_increase,
            total_gains,
        });

        self.is_need_forbid_node(address, fix_accumulated_gains)
    }

    /*
     * @notice 投资更新数据
     */
    public(package) fun update_invest(
        self: &mut Invest,
        address: address,
        amount: u64,
    ) {
        // 总投资金额
        let is_exists = self.total_investment.contains(&address);
        let total_investment = if (is_exists) {
            let total_investment = *self.total_investment.get(&address);
            let total_investment = total_investment + amount;
            self.total_investment.remove(&address);

            total_investment
        } else {
            amount
        };
        self.total_investment.insert(address, total_investment);

        // 最新一次投资金额
        let is_exists = self.last_investment.contains(&address);
        if (is_exists) {
            self.last_investment.remove(&address);
        };
        self.last_investment.insert(address, amount);

        event::emit(UpdateInvest {
            address,
            amount,
            is_increase: true,
            total_investment
        });

        // 总收益金额
        let is_exists = self.total_gains.contains(&address);
        let total_gains: u64 = if (is_exists) {
            *self.last_accumulated_gains.get(&address)
        } else {
            0
        };

        // 最近一次收益累计金额
        let is_exists = self.last_accumulated_gains.contains(&address);
        if (is_exists) {
            self.last_accumulated_gains.remove(&address);
        };
        self.last_accumulated_gains.insert(address, 0);

        event::emit(UpdateGains {
            address,
            amount: 0,
            is_increase: true,
            total_gains
        });
    }

    /*
     * @notice 收益更新数据
     */
    public(package) fun update_gains(
        self: &mut Invest,
        address: address,
        amount: u64,
    ): bool {
        // 总收益金额
        let is_exists = self.total_gains.contains(&address);
        let total_gains = if (is_exists) {
            let total_gains = *self.total_gains.get(&address);
            let total_gains = total_gains + amount;
            self.total_gains.remove(&address);

            total_gains
        } else {
            amount
        };
        self.total_gains.insert(address, total_gains);

        event::emit(UpdateGains {
            address,
            amount,
            is_increase: true,
            total_gains
        });

        // 最近一次收益累计金额
        let is_exists = self.last_accumulated_gains.contains(&address);
        let accumulated_gains = if (is_exists) {
            let accumulated_gains = self.last_accumulated_gains.get(&address);
            let accumulated_gains = *accumulated_gains + amount;
            self.last_accumulated_gains.remove(&address);

            accumulated_gains
        } else {
            amount
        };
        self.last_accumulated_gains.insert(address, accumulated_gains);

        self.is_need_forbid_node(address, accumulated_gains)
    }

    public fun is_need_forbid_node(
        self: &Invest,
        address: address,
        accumulated_gains: u64,
    ): bool {
        let is_exists = self.last_investment.contains(&address);
        if (is_exists) {
            let last_investment = self.last_investment.get(&address);
            // 如果收益为2倍，则禁用权益
            accumulated_gains >= *last_investment * 2
        } else {
            false
        }
    }

    public fun info(self: &Invest, address: address): (u64, u64, u64, u64) {
        let total_investment: u64 = if (self.total_investment.contains(&address)) {
            *self.total_investment.get(&address)
        } else {
            0
        };

        let total_gains: u64 = if (self.total_gains.contains(&address)) {
            *self.total_gains.get(&address)
        } else {
            0
        };

        let last_investment: u64 = if (self.last_investment.contains(&address)) {
            *self.last_investment.get(&address)
        } else {
            0
        };

        let last_accumulated_gains: u64 = if (self.last_accumulated_gains.contains(&address)) {
            *self.last_accumulated_gains.get(&address)
        } else {
            0
        };

        (
            total_investment,
            total_gains,
            last_investment,
            last_accumulated_gains
        )
    }

    // 读取Invest的UID
    public fun uid(self: &Invest): &UID {
        &self.id
    }
}
