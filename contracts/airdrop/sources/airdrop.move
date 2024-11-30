module airdrop::airdrop {
    // === Imports ===

    use sui::coin::{Self, Coin};
    use sui::balance::{Self, Balance};
    use sui::vec_map::{Self, VecMap};
    use sui::bag::{Self, Bag};
    use std::type_name::{Self, TypeName};
    use sui::event::{Self};
    use sui::clock::{Self, Clock};
    use airdrop::invite::{Self, Invite};
    use airdrop::node::{Self, Nodes};

    // 异常: 余额不足
    const ECoinBalanceNotEnough: u64 = 1;
    // 异常: 轮次不存在
    const ERoundNotFound: u64 = 2;
    // 异常: 轮次已存在
    const ERoundExited: u64 = 3;
    // 异常: 不在空投领取时间内
    const EInvalidClaimTime: u64 = 4;
    // 异常: 无可领取的空投
    const ENoRemainingShares: u64 = 5;

    // === Struct ===

    // 空投列表对象
    public struct Airdrops has key, store {
        id: UID,
        // 空投信息
        airdrops: VecMap<u64, Airdrop>,
        // 资金池
        treasury_balances: Bag,
        // 回合编号
        round_index: u64,
    }

    // 空投对象
    public struct Airdrop has store {
        // 轮次
        round: u64,
        // 开始时间
        start_time: u64,
        // 结束时间
        end_time: u64,
        // 总份数
        total_shares: u64,
        // 已领取份数
        claimed_shares: u64,
        // 总资金
        total_balance: u64,
        // 是否开放
        is_open: bool,
        // 描述
        description: vector<u8>,
        // 货币类型
        coin_type: TypeName
    }

    // 管理员权限对象
    public struct AdminCap has key, store {
        id: UID,
    }

    public struct AirdropInfo has copy, drop {
        // 轮次
        round: u64,
        // 开始时间
        start_time: u64,
        // 结束时间
        end_time: u64,
        // 总份数
        total_shares: u64,
        // 已领取份数
        claimed_shares: u64,
        // 总资金
        total_balance: u64,
        // 是否开放
        is_open: bool,
        // 描述
        description: vector<u8>,
        // 货币类型
        coin_type: TypeName,
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
    entry fun new(
        _admin_cap: &AdminCap,
        ctx: &mut TxContext
    ) {
        let airdrops = Airdrops {
            id: object::new(ctx),
            airdrops: vec_map::empty(),
            treasury_balances: bag::new(ctx),
            round_index: 0,
        };
        transfer::public_share_object(airdrops);
    }

    /*
     * @notice 增加空投
     *
     * @param T: 代币类型
     * @param _admin_cap: AdminCap对象
     * @param airdrops: airdrops对象
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
    entry fun insert<T>(
        _admin_cap: &AdminCap,
        airdrops: &mut Airdrops,
        start_time: u64,
        end_time: u64,
        total_shares: u64,
        total_balance: u64,
        description: vector<u8>,
        mut wallet: Coin<T>,
        ctx: &mut TxContext,
    ) {
        assert!(coin::value(&wallet) >= total_balance, ECoinBalanceNotEnough);

        airdrops.round_index = airdrops.round_index +1;
        let round = airdrops.round_index;

        // 处理多余的入金
        let sender = tx_context::sender(ctx);
        let excess_amount = coin::value(&wallet) - total_balance;
        if (excess_amount > 0) {
            let excess_coin = coin::split(&mut wallet, excess_amount, ctx);
            transfer::public_transfer(excess_coin, sender);
        };

        let coin_type = type_name::get<T>();

        // 增加空投对象
        let aidrop = Airdrop {
            round,
            start_time,
            end_time,
            total_shares,
            claimed_shares: 0,
            total_balance,
            is_open: true,
            description,
            coin_type,
        };
        vec_map::insert(&mut airdrops.airdrops, round, aidrop);
        bag::add(&mut airdrops.treasury_balances, round, coin::into_balance(wallet));
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
    entry fun modify(
        _admin_cap: &AdminCap,
        airdrops: &mut Airdrops,
        round: u64,
        start_time: u64,
        end_time: u64,
        is_open: bool,
        description: vector<u8>,
    ) {
        assert_round_not_found(airdrops, round);
        let aidrop: &mut Airdrop = vec_map::get_mut(&mut airdrops.airdrops, &round);
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
        let sender = tx_context::sender(ctx);
        assert_round_not_found(airdrops, round);
        let aidrop_balance: &mut Balance<T> = bag::borrow_mut(&mut airdrops.treasury_balances, round);
        let treasury_balance = balance::withdraw_all(aidrop_balance);
        let treasury_coin = coin::from_balance(treasury_balance, ctx);
        transfer::public_transfer(treasury_coin, sender);
    }

    /*
     * @notice 领取空投
     */
    entry fun claim<T>(
        airdrops: &mut Airdrops,
        nodes: &mut Nodes,
        round: u64,
        clock: &Clock,
        ctx: &mut TxContext,
    ) {
        let sender = tx_context::sender(ctx);
        assert_round_not_found(airdrops, round);
        let airdrop: &mut Airdrop = vec_map::get_mut(&mut airdrops.airdrops, &round);

        assert_invalid_claim_time(clock, airdrop);
        assert_no_remaining_shares(airdrop);

        node::update_purchased_quantity(nodes, sender, round);
        let per_share_amount = airdrop.total_balance / airdrop.total_shares;
        airdrop.claimed_shares = airdrop.claimed_shares + 1;
        let treasury_balance = bag::borrow_mut<u64, Balance<T>>(&mut airdrops.treasury_balances, round);
        let treasury_balance_part = balance::split<T>(treasury_balance, per_share_amount);
        let treasury_coina_part: Coin<T> = coin::from_balance<T>(treasury_balance_part, ctx);
        transfer::public_transfer(treasury_coina_part, sender);
    }

    public fun new_invite(
        _admin_cap: &AdminCap,
        root: address,
        inviter_fee: u64,
        ctx: &mut TxContext
    ) {
        invite::new(root, inviter_fee, ctx);
    }

    public fun modify_invite(
        _admin_cap: &AdminCap,
        invite: &mut Invite,
        root: address,
        inviter_fee: u64,
    ) {
        invite::modify(invite, root, inviter_fee);
    }

    public fun new_node<T>(
        _admin_cap: &AdminCap,
        receiver: address,
        ctx: &mut TxContext
    ) {
        node::new<T>(receiver, ctx);
    }

    public fun insert_node(
        _admin_cap: &AdminCap,
        nodes: &mut Nodes,
        name: vector<u8>,
        description: vector<u8>,
        limit: u64,
        price: u64,
        total_quantity: u64,
    ) {
        node::insert(nodes, name, description, limit, price, total_quantity);
    }

    // public fun remove_node(
    //     _admin_cap: &AdminCap,
    //     nodes: &mut Nodes,
    //     rank: u8
    // ) {
    //     node::remove(nodes, rank);
    // }

    public fun modify_node(
        _admin_cap: &AdminCap,
        nodes: &mut Nodes,
        rank: u8,
        name: vector<u8>,
        description: vector<u8>,
        price: u64,
    ) {
        node::modify(nodes, rank, name, description,  price);
    }

    public fun airdrops(airdrops: &Airdrops) {
        let length = vec_map::size(&airdrops.airdrops);
        let mut i = 1;
        while (i < length + 1) {
            let airdrop = vec_map::get(&airdrops.airdrops, &i);
            event::emit(AirdropInfo {
                round: airdrop.round,
                start_time: airdrop.start_time,
                end_time: airdrop.end_time,
                total_shares: airdrop.total_shares,
                claimed_shares: airdrop.claimed_shares,
                total_balance: airdrop.total_balance,
                is_open: airdrop.is_open,
                description: airdrop.description,
                coin_type: airdrop.coin_type,
            });
            i = i + 1;
        };
    }

    // === Assertions ===

    public fun assert_round_exited(airdrops: &Airdrops, round: u64) {
        assert!(!vec_map::contains(&airdrops.airdrops, &round), ERoundExited);
    }

    public fun assert_round_not_found(airdrops: &Airdrops, round: u64) {
        assert!(vec_map::contains(&airdrops.airdrops, &round), ERoundNotFound);
    }

    public fun assert_invalid_claim_time(clock: &Clock, airdrop: &Airdrop) {
        let current_time = clock::timestamp_ms(clock);
        assert!(current_time >= airdrop.start_time && current_time <= airdrop.end_time, EInvalidClaimTime);
    }

    public fun assert_no_remaining_shares(airdrop: &Airdrop) {
        assert!(airdrop.total_shares - airdrop.claimed_shares > 0, ENoRemainingShares);
    }

    // === Testing ===

    #[test_only]
    entry fun init_for_test(ctx: &mut TxContext) {
        init(ctx);
    }
}