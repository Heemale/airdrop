module airdrop::invest {

    use sui::event;
    use sui::vec_map::{Self, VecMap};

    // === Struct ===

    public struct INVEST has drop {}

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
        is_increse: bool,
        // 总投资金额
        total_investment: u64,
    }

    public struct UpdateGains has copy, drop {
        // 用户
        address: address,
        // 数量
        amount: u64,
        // 是否增加
        is_increse: bool,
        // 总收益金额
        total_gains: u64,
    }

    fun init(_witness: INVEST, ctx: &mut TxContext) {
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
        invest: &mut Invest,
        address: address,
        fix_total_investment: u64,
        fix_total_gains: u64,
        fix_last_investment: u64,
        fix_accumulated_gains: u64,
    ): bool {
        // 总投资金额
        let is_exists = invest.total_investment.contains(&address);
        if (is_exists) {
            let total_investment = *invest.total_investment.get(&address);

            let is_increse = fix_total_investment > total_investment;
            let amount = if (is_increse) {
                fix_total_investment - total_investment
            } else {
                total_investment - fix_total_investment
            };

            invest.total_investment.remove(&address);
            invest.total_investment.insert(address, fix_total_investment);

            event::emit(UpdateInvest {
                address,
                amount,
                is_increse,
                total_investment,
            });
        } else {
            invest.total_investment.insert(address, fix_total_investment);

            event::emit(UpdateInvest {
                address,
                amount: fix_total_investment,
                is_increse: true,
                total_investment: fix_total_investment
            });
        };

        // 总收益金额
        let is_exists = invest.total_gains.contains(&address);
        if (is_exists) {
            let total_gains = *invest.total_gains.get(&address);

            let is_increse = fix_total_gains > total_gains;
            let amount = if (is_increse) {
                fix_total_gains - total_gains
            } else {
                total_gains - fix_total_gains
            };

            invest.total_investment.remove(&address);
            invest.total_investment.insert(address, fix_total_gains);

            event::emit(UpdateGains {
                address,
                amount,
                is_increse,
                total_gains,
            });
        } else {
            invest.total_investment.insert(address, fix_total_gains);

            event::emit(UpdateGains {
                address,
                amount: fix_total_gains,
                is_increse: true,
                total_gains: fix_total_gains
            });
        };

        // 最新一次投资金额
        let is_exists = invest.last_investment.contains(&address);
        if (is_exists) {
            invest.last_investment.remove(&address);
            invest.last_investment.insert(address, fix_last_investment);
        } else {
            invest.last_investment.insert(address, fix_last_investment);
        };

        // 最近一次收益累计金额
        let is_exists = invest.last_accumulated_gains.contains(&address);
        if (is_exists) {
            invest.last_accumulated_gains.remove(&address);
            invest.last_accumulated_gains.insert(address, fix_accumulated_gains);
        } else {
            invest.last_accumulated_gains.insert(address, fix_accumulated_gains);
        };
        is_need_forbid_node(invest, address, fix_accumulated_gains)
    }

    /*
     * @notice 更新投资数据
     */
    public(package) fun update_invest(
        invest: &mut Invest,
        address: address,
        amount: u64,
    ) {
        // 总投资金额
        let is_exists = invest.total_investment.contains(&address);
        if (is_exists) {
            let total_investment = *invest.total_investment.get(&address);
            let total_investment = total_investment + amount;
            invest.total_investment.remove(&address);
            invest.total_investment.insert(address, total_investment);

            event::emit(UpdateInvest {
                address,
                amount,
                is_increse: true,
                total_investment
            });
        } else {
            invest.total_investment.insert(address, amount);

            event::emit(UpdateInvest {
                address,
                amount,
                is_increse: true,
                total_investment: amount
            });
        };

        // 最新一次投资金额
        let is_exists = invest.last_investment.contains(&address);
        if (is_exists) {
            invest.last_investment.remove(&address);
        };
        invest.last_investment.insert(address, amount);

        // 最近一次收益累计金额
        let is_exists = invest.last_accumulated_gains.contains(&address);
        if (is_exists) {
            invest.last_accumulated_gains.remove(&address);
        };
        invest.last_accumulated_gains.insert(address, 0);
    }

    /*
     * @notice 更新收益数据
     */
    public(package) fun update_gains(
        invest: &mut Invest,
        address: address,
        amount: u64,
    ): bool {
        // 总收益金额
        let is_exists = invest.total_gains.contains(&address);
        if (is_exists) {
            let total_gains = *invest.total_gains.get(&address);
            let total_gains = total_gains + amount;
            invest.total_gains.remove(&address);
            invest.total_gains.insert(address, total_gains);

            event::emit(UpdateGains {
                address,
                amount,
                is_increse: true,
                total_gains
            });
        } else {
            invest.total_gains.insert(address, amount);

            event::emit(UpdateGains {
                address,
                amount,
                is_increse: true,
                total_gains: amount
            });
        };

        // 最近一次收益累计金额
        let is_exists = invest.last_accumulated_gains.contains(&address);
        if (is_exists) {
            let accumulated_gains = invest.last_accumulated_gains.get(&address);
            let accumulated_gains = *accumulated_gains + amount;
            invest.last_accumulated_gains.remove(&address);
            invest.last_accumulated_gains.insert(address, accumulated_gains);

            is_need_forbid_node(invest, address, accumulated_gains)
        } else {
            invest.last_accumulated_gains.insert(address, amount);

            is_need_forbid_node(invest, address, amount)
        }
    }

    public fun is_need_forbid_node(
        invest: &Invest,
        address: address,
        accumulated_gains: u64,
    ): bool {
        let is_exists = invest.last_investment.contains(&address);
        if (is_exists) {
            let last_investment = invest.last_investment.get(&address);
            // 如果收益为2倍，则禁用权益
            accumulated_gains >= *last_investment * 2
        } else {
            false
        }
    }
}
