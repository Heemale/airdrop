module airdrop::invest {

    use sui::vec_map::{Self, VecMap};

    // 投资对象
    public struct Invest has key, store {
        id: UID,
        // 总投资金额
        total_investment: VecMap<address, u64>,
        // 最新一次投资金额
        last_investment: VecMap<address, u64>,
        // 最近一次收益累计金额
        accumulated_gains: VecMap<address, u64>,
    }

    /*
     * @notice 创建投资对象
     */
    public(package) fun new(ctx: &mut TxContext) {
        let invest = Invest {
            id: object::new(ctx),
            total_investment: vec_map::empty(),
            last_investment: vec_map::empty(),
            accumulated_gains: vec_map::empty(),
        };
        transfer::public_share_object(invest);
    }

    /*
     * @notice 修改投资对象
     */
    public(package) fun modify(_ctx: &mut TxContext) {
        // TODO 每次更改要发事件。
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
            let total_investment = invest.total_investment.get(&address);
            let total_investment = *total_investment + amount;
            invest.total_investment.remove(&address);
            invest.total_investment.insert(address, total_investment);
        } else {
            invest.total_investment.insert(address, amount);
        };

        // 最新一次投资金额
        let is_exists = invest.last_investment.contains(&address);
        if (is_exists) {
            let last_investment = invest.last_investment.get(&address);
            let last_investment = *last_investment + amount;
            invest.last_investment.remove(&address);
            invest.last_investment.insert(address, last_investment);
        } else {
            invest.last_investment.insert(address, amount);
        };

        // 最近一次收益累计金额
        let is_exists = invest.accumulated_gains.contains(&address);
        if (is_exists) {
            invest.accumulated_gains.remove(&address);
            invest.accumulated_gains.insert(address, 0);
        } else {
            invest.accumulated_gains.insert(address, 0);
        };
    }

    /*
     * @notice 更新收益数据
     */
    public(package) fun update_gains(
        invest: &mut Invest,
        address: address,
        amount: u64,
    ): bool {
        // 最近一次收益累计金额
        let is_exists = invest.accumulated_gains.contains(&address);
        if (is_exists) {
            let accumulated_gains = invest.accumulated_gains.get(&address);
            let accumulated_gains = *accumulated_gains + amount;
            invest.accumulated_gains.remove(&address);
            invest.accumulated_gains.insert(address, accumulated_gains);

            is_need_forbid_node(invest, address, accumulated_gains)
        } else {
            invest.accumulated_gains.insert(address, amount);

            is_need_forbid_node(invest, address, amount)
        }
    }

    public(package) fun is_need_forbid_node(
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
