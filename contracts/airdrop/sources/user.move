module airdrop::user {

    use sui::vec_map::{Self, VecMap};

    // 投资信息对象
    // public struct Invest has key, store {
    //     // 总投资金额
    //     total_investment: VecMap<address, u64>,
    //     // 最新一次投资金额
    //     last_investment: VecMap<address, u64>,
    //     // 最近一次收益累计金额
    //     accumulated_gains: VecMap<address, u64>,
    // }

    // 特殊限制列表对象
    public struct SpecialLimits has key, store {
        id: UID,
        // 列表
        list: VecMap<address, Limit>,
    }

    // 特殊限制对象
    public struct Limit has store, drop {
        // 限制次数
        times: u64,
        // 是否限制
        isLimit: bool,
    }

    /*
     * @notice 创建特殊限制列表对象
     */
    public(package) fun new(ctx: &mut TxContext) {
        let special_limits = SpecialLimits {
            id: object::new(ctx),
            list: vec_map::empty(),
        };
        transfer::public_share_object(special_limits);
    }

    /*
     * @notice 修改特殊限制
     *
     * @param special_limits: 特殊限制列表
     * @param address: 用户地址
     * @param times: 次数
     * @param isLimit: 是否限制
     */
    public(package) fun modify(
        special_limits: &mut SpecialLimits,
        address: address,
        times: u64,
        is_limit: bool,
    ) {
        let is_exists = special_limits.list.contains(&address);
        if (is_exists) {
            let limit: &mut Limit = special_limits.list.get_mut(&address);
            limit.times = times;
            limit.isLimit = is_limit;
        } else {
            let limit = Limit {
                times,
                isLimit: is_limit,
            };
            special_limits.list.insert(address, limit);
        }
    }

    public fun special_limit_remaining_quantity(
        special_limits: &SpecialLimits,
        address: &address,
        node_purchased_quantity: u64,
        user_purchased_quantity: u64,
    ): u64 {
        // 是否在限制名单中
        let is_exists = special_limits.list.contains(address);
        if (is_exists) {
            // 是否被限制
            let limit = special_limits.list.get(address);
            if (limit.isLimit) {
                if (user_purchased_quantity > limit.times) {
                    0
                } else {
                    limit.times - user_purchased_quantity
                }
            } else {
                node_purchased_quantity - user_purchased_quantity
            }
        } else {
            node_purchased_quantity - user_purchased_quantity
        }
    }
}
