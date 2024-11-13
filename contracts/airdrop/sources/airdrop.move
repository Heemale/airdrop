module airdrop::airdrop {
    // === Imports ===

    use sui::object_bag::{Self, ObjectBag};
    use sui::coin::{Self, Coin};
    use sui::balance::{Self, Balance};
    use sui::event::{Self};
    use sui::clock::{Self, Clock};
    use airdrop::node::{Self, Node};

    // 异常: 余额不足
    const ECoinBalanceNotEnough: u64 = 9;
    // 异常: 轮次不存在
    const ERoundNotFound: u64 = 10;
    // 异常: 轮次已存在
    const ERoundExited: u64 = 11;
    // 异常: 空投已结束
    const EInvalidAirDrop: u64 = 1009;
    // 不在空投领取时间内
    const EClaimTimeInvalid: u64 = 1011;
    // 无可领取的空投
    const ENoRemainingShares: u64 = 1012;
    // 币种未设置
    const ETokenNotSet: u64 = 1013;

    // === Struct ===

    // 空投列表对象
    public struct Airdrops has key, store {
        id: UID,
        airdrops: ObjectBag,
    }

    // 空投对象
    public struct Airdrop<phantom T> has key, store {
        id: UID,
        // 开始时间
        start_time: u64,
        // 结束时间
        end_time: u64,
        // 总份数
        total_shares: u64,
        // 剩余份数
        remaining_shares: u64,
        // 总资金
        total_balance: u64,
        // 资金
        treasury_balance: Balance<T>,
        // 是否开放
        is_open: bool,
        // 描述
        description: vector<u8>
    }

    // 管理员权限对象
    public struct AdminCap has key, store {
        id: UID,
    }

    public struct AirdropInfo has copy, drop {
        round: u64,
        // 开始时间
        start_time: u64,
        // 结束时间
        end_time: u64,
        // 总份数
        total_shares: u64,
        // 剩余份数
        remaining_shares: u64,
        // 总资金
        total_balance: u64,
        // 是否开放
        is_open: bool,
        // 描述
        description: vector<u8>
    }

    fun init(ctx: &mut TxContext) {
        let sender = tx_context::sender(ctx);
        let admin_cap = AdminCap {
            id: object::new(ctx),
        };
        transfer::public_transfer(admin_cap, sender);
    }

    /*
     * @notice 创建空投对象
     *
     * @param T: 代币类型
     * @param _admin_cap: AdminCap对象
     */
    entry fun new_airdrops(
        _admin_cap: &AdminCap,
        ctx: &mut TxContext
    ) {
        let airdrops = Airdrops {
            id: object::new(ctx),
            airdrops: object_bag::new(ctx),
        };
        transfer::public_share_object(airdrops);
    }

    /*
     * @notice 增加空投
     *
     * @param T: 代币类型
     * @param _admin_cap: AdminCap对象
     * @param airdrops: airdrops对象
     * @param round: 轮次
     * @param start_time: 开始时间
     * @param end_time: 结束时间
     * @param total_shares: 总份数
     * @param total_balance: 总资金
     * @param wallet: 支付的代币对象
     *
     * aborts-if:
     * - 支付的资金和total_balance不匹配
     * - 空投回合已存在
     */
    entry fun insert_airdrop<T>(
        _admin_cap: &AdminCap,
        airdrops: &mut Airdrops,
        round: u64,
        start_time: u64,
        end_time: u64,
        total_shares: u64,
        total_balance: u64,
        description: vector<u8>,
        mut wallet: Coin<T>,
        ctx: &mut TxContext,
    ) {
        assert!(coin::value(&wallet) >= total_balance, ECoinBalanceNotEnough);
        assert_round_exited(airdrops, round);

        // 处理多余的入金
        let sender = tx_context::sender(ctx);
        let excess_amount = coin::value(&wallet) - total_balance;
        if (excess_amount > 0) {
            let excess_coin = coin::split(&mut wallet, excess_amount, ctx);
            transfer::public_transfer(excess_coin, sender);
        };

        // 增加空投对象
        let aidrop = Airdrop<T> {
            id: object::new(ctx),
            start_time,
            end_time,
            total_shares,
            remaining_shares: total_balance,
            total_balance,
            treasury_balance: coin::into_balance(wallet),
            is_open: true,
            description
        };
        object_bag::add(&mut airdrops.airdrops, round, aidrop);
    }

    /*
     * @notice 修改空投
     *
     * @param T: 代币类型
     * @param _admin_cap: AdminCap对象
     * @param airdrops: airdrops对象
     * @param round: 轮次
     * @param start_time: 开始时间
     * @param end_time: 结束时间
     * @param is_open: 是否开启
     *
     * aborts-if:
     * - 空投回合不存在
     */
    entry fun modify_airdrop<T>(
        _admin_cap: &AdminCap,
        airdrops: &mut Airdrops,
        round: u64,
        start_time: u64,
        end_time: u64,
        is_open: bool,
        description: vector<u8>,
    ) {
        assert_round_not_found(airdrops, round);
        let aidrop: &mut Airdrop<T> = object_bag::borrow_mut(&mut airdrops.airdrops, round);
        aidrop.start_time = start_time;
        aidrop.end_time = end_time;
        aidrop.is_open = is_open;
        aidrop.description = description;
    }

    /*
     * @notice 提取空投资金
     *
     * @param T: 代币类型
     * @param _admin_cap: AdminCap对象
     * @param airdrops: airdrops对象
     * @param round: 轮次
     *
     * aborts-if:
     * - 空投回合不存在
     */
    entry fun withdraw<T>(
        _admin_cap: &AdminCap,
        airdrops: &mut Airdrops,
        round: u64,
        ctx: &mut TxContext
    ) {
        assert_round_not_found(airdrops, round);
        let aidrop: &mut Airdrop<T> = object_bag::borrow_mut(&mut airdrops.airdrops, round);
        let sender = tx_context::sender(ctx);
        let treasury_balance = balance::withdraw_all(&mut aidrop.treasury_balance);
        let treasury_coin = coin::from_balance(treasury_balance, ctx);
        transfer::public_transfer(treasury_coin, sender);
    }

    public fun airdrops<T>(airdrops: &Airdrops) {
        let length = object_bag::length(&airdrops.airdrops);
        let mut i = 1;
        while (i < length + 2) {
            let airdrop: &Airdrop<T> = object_bag::borrow(&airdrops.airdrops, i);
            event::emit(AirdropInfo {
                start_time: airdrop.start_time,
                end_time: airdrop.end_time,
                total_shares: airdrop.total_shares,
                remaining_shares: airdrop.remaining_shares,
                total_balance: airdrop.total_balance,
                is_open: airdrop.is_open,
            });
            i = i + 1;
        };
    }

    /*
     * @notice 领取空投
     */
    entry fun claim_airdrop<T>(
        airdrops: &mut Airdrops,
        node: &Node,
        round: u64,
        clock: &Clock,
        ctx: &mut TxContext,
    ) {
        let sender = tx_context::sender(ctx);
        assert!(object_bag::contains(&airdrops.airdrops, round), EInvalidAirDrop);
        let airdrop: &mut Airdrop<T> = object_bag::borrow_mut(&mut airdrops.airdrops, round);

        // 检查是否在空投时间范围内
        let current_time = clock::timestamp_ms(clock);
        assert!(current_time >= airdrop.start_time && current_time <= airdrop.end_time, EClaimTimeInvalid);
        assert!(airdrop.total_shares > 0, ENoRemainingShares);
        //获取已领取次数
        // let user_rank: &u8 = vec_map::get(&config.users, &sender);
        node::assert_node_sold_out(node);
        let per_share_amount = airdrop.total_balance / airdrop.total_shares;
        airdrop.remaining_shares = airdrop.remaining_shares - 1;
        let treasury_balance = balance::split<T>(&mut airdrop.treasury_balance, per_share_amount);
        let treasury_coin = coin::from_balance(treasury_balance, ctx);
        transfer::public_transfer(treasury_coin, sender);
    }

    // === Assertions ===

    public fun assert_round_exited(airdrops: &Airdrops, round: u64) {
        assert!(!object_bag::contains(&airdrops.airdrops, round), ERoundExited);
    }

    public fun assert_round_not_found(airdrops: &Airdrops, round: u64) {
        assert!(object_bag::contains(&airdrops.airdrops, round), ERoundNotFound);
    }

    // === Testing ===

    #[test_only]
    entry fun init_for_test(ctx: &mut TxContext) {
        init(ctx);
    }
}