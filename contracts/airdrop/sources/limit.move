module airdrop::limit {

    use sui::event;
    use sui::vec_map::{Self, VecMap};

    // === Struct ===

    // 特殊列表对象
    public struct Limits has key, store {
        id: UID,
        // 特殊限制列表
        special_user_limit: VecMap<address, SpecialUserLimit>,
    }

    // 特殊限制对象
    public struct SpecialUserLimit has store, drop {
        // 限制次数
        times: u64,
        // 是否限制
        is_limit: bool,
    }

    // === Event ===

    public struct ModifyLimit has copy, drop {
        // 地址
        address: address,
        // 限制次数
        times: u64,
        // 是否限制
        is_limit: bool,
    }

    public(package) fun new(ctx: &mut TxContext) {
        let limits = Limits {
            id: object::new(ctx),
            special_user_limit: vec_map::empty(),
        };
        transfer::public_share_object(limits);
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
        self: &mut Limits,
        address: address,
        times: u64,
        is_limit: bool,
    ) {
        let is_exists = self.special_user_limit.contains(&address);
        if (is_exists) {
            let special_user_limit: &mut SpecialUserLimit = self.special_user_limit.get_mut(&address);
            special_user_limit.times = times;
            special_user_limit.is_limit = is_limit;
        } else {
            let special_user_limit = SpecialUserLimit {
                times,
                is_limit: is_limit,
            };
            self.special_user_limit.insert(address, special_user_limit);
        };

        event::emit(ModifyLimit {
            address,
            times,
            is_limit
        });
    }

    public fun special_limit_remaining_claim_times(
        self: &Limits,
        address: &address,
        node_limit_times: u64,
        user_claimed_times: u64,
    ): u64 {
        // 是否在限制名单中
        let is_exists = self.special_user_limit.contains(address);
        if (is_exists) {
            // 是否被限制
            let special_user_limit = self.special_user_limit.get(address);
            if (special_user_limit.is_limit) {
                if (special_user_limit.times > user_claimed_times) {
                    special_user_limit.times - user_claimed_times
                } else {
                    0
                }
            } else {
                if (node_limit_times > user_claimed_times) {
                    node_limit_times - user_claimed_times
                } else {
                    0
                }
            }
        } else {
            if (node_limit_times > user_claimed_times) {
                node_limit_times - user_claimed_times
            } else {
                0
            }
        }
    }

    public fun special_user_limit(self: &Limits, address: address): (u64, bool) {
        let is_exists = self.special_user_limit.contains(&address);
        if (is_exists) {
            let special_user_limit: &SpecialUserLimit = self.special_user_limit.get(&address);
            (special_user_limit.times, special_user_limit.is_limit)
        } else {
            (0, false)
        }
    }

    // 读取Limits的UID
    public fun uid(self: &Limits): &UID {
        &self.id
    }
}
