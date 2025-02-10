module airdrop::airdrop {
    // === Imports ===

    use sui::sui::{SUI};
    use sui::coin::{Self, Coin};
    use sui::balance::{Balance};
    use sui::vec_map::{Self, VecMap};
    use sui::bag::{Self, Bag};
    use std::type_name::{Self, TypeName};
    use sui::event::{Self};
    use sui::clock::{Self, Clock};
    use airdrop::invite::{Self, Invite};
    use airdrop::node::{Self, Nodes};
    use airdrop::limit::{Self, Limits};
    use airdrop::invest::{Self, Invest};
    use airdrop::global::{Global};

    // === Error ===

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
    // 异常：方法已弃用
    const EMethodDeprecated: u64 = 6;

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
    public struct Airdrop has store, drop {
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
        // 空投图片
        image_url: vector<u8>,
        // 空投剩余资金
        remaining_balance: u64,
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
        // 空投图片
        image_url: vector<u8>,
        // 空投剩余资金
        remaining_balance: u64,
    }

    // === Event ===

    public struct Claim has copy, drop {
        // 用户
        sender: address,
        // 回合
        round: u64,
        // 币种
        coin_type: TypeName,
        // 数量
        amount: u64,
    }

    public struct AirdropChange has copy, drop {
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
        // 空投图片
        image_url: vector<u8>,
        // 空投剩余资金
        remaining_balance: u64,
        // 是否移除
        is_remove: bool,
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
     * @param description: 描述
     * @param wallet: 支付的代币对象
     * @param image_url: 图片链接
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
        image_url: vector<u8>,
        ctx: &mut TxContext,
    ) {
        assert!(wallet.value() >= total_balance, ECoinBalanceNotEnough);

        airdrops.round_index = airdrops.round_index + 1;
        let round = airdrops.round_index;

        // 处理多余的入金
        let sender = tx_context::sender(ctx);
        let excess_amount = wallet.value() - total_balance;
        if (excess_amount > 0) {
            let excess_coin = wallet.split(excess_amount, ctx);
            transfer::public_transfer(excess_coin, sender);
        };

        let coin_type = type_name::get<T>();

        // 增加空投对象
        let airdrop = Airdrop {
            round,
            start_time,
            end_time,
            total_shares,
            claimed_shares: 0,
            total_balance,
            is_open: true,
            description,
            coin_type,
            image_url,
            remaining_balance: total_balance,
        };

        event::emit(AirdropChange {
            round: airdrop.round,
            start_time: airdrop.start_time,
            end_time: airdrop.end_time,
            total_shares: airdrop.total_shares,
            claimed_shares: airdrop.claimed_shares,
            total_balance: airdrop.total_balance,
            is_open: airdrop.is_open,
            description: airdrop.description,
            coin_type: airdrop.coin_type,
            image_url: airdrop.image_url,
            remaining_balance: airdrop.remaining_balance,
            is_remove: false
        });

        airdrops.airdrops.insert(round, airdrop);
        bag::add(&mut airdrops.treasury_balances, round, coin::into_balance(wallet));
    }

    entry fun remove<T>(
        admin_cap: &AdminCap,
        airdrops: &mut Airdrops,
        round: u64,
        ctx: &mut TxContext
    ) {
        let sender = tx_context::sender(ctx);

        withdraw_internal<T>(admin_cap, airdrops, round, sender, ctx);

        let airdrop: &Airdrop = airdrops.airdrops.get(&round);

        event::emit(AirdropChange {
            round: airdrop.round,
            start_time: airdrop.start_time,
            end_time: airdrop.end_time,
            total_shares: airdrop.total_shares,
            claimed_shares: airdrop.claimed_shares,
            total_balance: airdrop.total_balance,
            is_open: airdrop.is_open,
            description: airdrop.description,
            coin_type: airdrop.coin_type,
            image_url: airdrop.image_url,
            remaining_balance: airdrop.remaining_balance,
            is_remove: true
        });

        airdrops.airdrops.remove(&round);
    }

    /*
     * @notice 修改空投
     *
     * @param _admin_cap: AdminCap对象
     * @param airdrops: airdrops对象
     * @param round: 轮次
     * @param start_time: 开始时间
     * @param end_time: 结束时间
     * @param is_open: 是否开启
     * @param description: 描述
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
        let airdrop: &mut Airdrop = airdrops.airdrops.get_mut(&round);
        airdrop.start_time = start_time;
        airdrop.end_time = end_time;
        airdrop.is_open = is_open;
        airdrop.description = description;

        event::emit(AirdropChange {
            round: airdrop.round,
            start_time: airdrop.start_time,
            end_time: airdrop.end_time,
            total_shares: airdrop.total_shares,
            claimed_shares: airdrop.claimed_shares,
            total_balance: airdrop.total_balance,
            is_open: airdrop.is_open,
            description: airdrop.description,
            coin_type: airdrop.coin_type,
            image_url: airdrop.image_url,
            remaining_balance: airdrop.remaining_balance,
            is_remove: false,
        });
    }

    /*
     * @notice 提取空投资金
     *
     * @param T: 代币类型
     * @param _admin_cap: AdminCap对象
     * @param airdrops: airdrops对象
     * @param round: 轮次
     */
    entry fun withdraw<T>(
        admin_cap: &AdminCap,
        airdrops: &mut Airdrops,
        round: u64,
        ctx: &mut TxContext
    ) {
        let sender = tx_context::sender(ctx);

        withdraw_internal<T>(admin_cap, airdrops, round, sender, ctx);

        let airdrop: &Airdrop = airdrops.airdrops.get(&round);

        event::emit(AirdropChange {
            round: airdrop.round,
            start_time: airdrop.start_time,
            end_time: airdrop.end_time,
            total_shares: airdrop.total_shares,
            claimed_shares: airdrop.claimed_shares,
            total_balance: airdrop.total_balance,
            is_open: airdrop.is_open,
            description: airdrop.description,
            coin_type: airdrop.coin_type,
            image_url: airdrop.image_url,
            remaining_balance: airdrop.remaining_balance,
            is_remove: false,
        });
    }

    fun withdraw_internal<T>(
        _admin_cap: &AdminCap,
        airdrops: &mut Airdrops,
        round: u64,
        receiver: address,
        ctx: &mut TxContext
    ) {
        assert_round_not_found(airdrops, round);
        let airdrop_balance: &mut Balance<T> = bag::borrow_mut(&mut airdrops.treasury_balances, round);
        let treasury_balance = airdrop_balance.withdraw_all();
        let treasury_coin = coin::from_balance(treasury_balance, ctx);
        let airdrop: &mut Airdrop = airdrops.airdrops.get_mut(&round);
        airdrop.is_open = false;
        airdrop.remaining_balance = 0;
        transfer::public_transfer(treasury_coin, receiver);
    }

    #[allow(unused_type_parameter)]
    entry fun claim<T>(
        _airdrops: &mut Airdrops,
        _nodes: &mut Nodes,
        _round: u64,
        _clock: &Clock,
        _special_limits: &Limits,
        _ctx: &mut TxContext,
    ) {
        assert!(false, EMethodDeprecated);
    }

    /*
     * @notice 领取空投
     */
    entry fun claim_v2<T>(
        airdrops: &mut Airdrops,
        nodes: &mut Nodes,
        round: u64,
        clock: &Clock,
        limits: &Limits,
        invest: &mut Invest,
        global: &Global,
        ctx: &mut TxContext,
    ) {
        global.assert_paused();
        global.assert_object_invalid(airdrops.uid());
        global.assert_object_invalid(nodes.uid());

        let sender = tx_context::sender(ctx);
        // 断言：回合需要存在
        assert_round_not_found(airdrops, round);
        let airdrop: &mut Airdrop = airdrops.airdrops.get_mut(&round);

        // 断言：时间需要合法
        assert_invalid_claim_time(clock, airdrop);
        // 断言：份额需要足够
        assert_no_remaining_shares(airdrop);
        // 断言：剩余领取次数需要足够
        node::assert_insufficient_remaining_quantity(nodes, sender, round, limits);
        node::update_claim_times(nodes, sender, round);

        let per_share_amount = airdrop.total_balance / airdrop.total_shares;
        airdrop.claimed_shares = airdrop.claimed_shares + 1;
        airdrop.remaining_balance = airdrop.remaining_balance - per_share_amount;
        let treasury_balance = bag::borrow_mut<u64, Balance<T>>(&mut airdrops.treasury_balances, round);
        let treasury_balance_part = treasury_balance.split<T>(per_share_amount);
        let treasury_coina_part: Coin<T> = coin::from_balance<T>(treasury_balance_part, ctx);
        transfer::public_transfer(treasury_coina_part, sender);

        let coin_type = type_name::get<T>();
        // 如果空投收益代币类型是SUI
        if (coin_type == type_name::get<SUI>()) {
            // 更新收益
            let is_need_forbiden = invest::update_gains(
                invest,
                sender,
                per_share_amount
            );
            // 如果达到条件，禁用权益
            if (is_need_forbiden) {
                node::forbiden(nodes, sender);
            };
        };

        event::emit(Claim {
            sender,
            round,
            coin_type,
            amount: per_share_amount,
        });

        event::emit(AirdropChange {
            round: airdrop.round,
            start_time: airdrop.start_time,
            end_time: airdrop.end_time,
            total_shares: airdrop.total_shares,
            claimed_shares: airdrop.claimed_shares,
            total_balance: airdrop.total_balance,
            is_open: airdrop.is_open,
            description: airdrop.description,
            coin_type: airdrop.coin_type,
            image_url: airdrop.image_url,
            remaining_balance: airdrop.remaining_balance,
            is_remove: false,
        });
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

    public fun modify_node(
        _admin_cap: &AdminCap,
        nodes: &mut Nodes,
        rank: u8,
        name: vector<u8>,
        description: vector<u8>,
        price: u64,
        limit: u64,
        total_quantity: u64,
        is_open: bool,
    ) {
        node::modify(nodes, rank, name, description, price, limit, total_quantity, is_open);
    }

    public fun modify_nodes<T>(
        _admin_cap: &AdminCap,
        nodes: &mut Nodes,
        receiver: address,
    ) {
        node::modify_nodes<T>(nodes, receiver);
    }

    public fun modify_special_limits(
        _admin_cap: &AdminCap,
        limits: &mut Limits,
        address: address,
        times: u64,
        is_limit: bool,
    ) {
        limit::modify(limits, address, times, is_limit);
    }

    public fun modify_invest(
        _admin_cap: &AdminCap,
        invest: &mut Invest,
        nodes: &mut Nodes,
        address: address,
        fix_total_investment: u64,
        fix_total_gains: u64,
        fix_last_investment: u64,
        fix_accumulated_gains: u64,
    ) {
        let is_need_forbiden = invest::modify(
            invest,
            address,
            fix_total_investment,
            fix_total_gains,
            fix_last_investment,
            fix_accumulated_gains
        );
        // 如果达到条件，禁用权益
        if (is_need_forbiden) {
            node::forbiden(nodes, address);
        };
    }

    public fun pause(
        _admin_cap: &AdminCap,
        global: &mut Global
    ) {
        global.pause();
    }

    public fun un_pause(
        _admin_cap: &AdminCap,
        global: &mut Global
    ) {
        global.un_pause();
    }

    public fun update_initialization_list(
        _admin_cap: &AdminCap,
        global: &mut Global,
        object: ID,
        is_valid: bool
    ) {
        global.update_initialization_list(object, is_valid);
    }

    public fun airdrops(airdrops: &Airdrops) {
        let length = airdrops.airdrops.size();
        let mut i = 1;
        while (i < length + 1) {
            let airdrop = airdrops.airdrops.get(&i);
            event::emit(AirdropInfo {
                round: airdrop.round,
                start_time: airdrop.start_time,
                end_time: airdrop.end_time,
                total_shares: airdrop.total_shares,
                claimed_shares: airdrop.claimed_shares,
                total_balance: airdrop.total_balance,
                is_open: airdrop.is_open,
                description: airdrop.description,
                image_url: airdrop.image_url,
                coin_type: airdrop.coin_type,
                remaining_balance: airdrop.remaining_balance,
            });
            i = i + 1;
        };
    }

    public fun uid(self: &Airdrops): &UID {
        &self.id
    }

    // === Assertions ===

    public fun assert_round_exited(airdrops: &Airdrops, round: u64) {
        assert!(!airdrops.airdrops.contains(&round), ERoundExited);
    }

    public fun assert_round_not_found(airdrops: &Airdrops, round: u64) {
        assert!(airdrops.airdrops.contains(&round), ERoundNotFound);
    }

    public fun assert_invalid_claim_time(clock: &Clock, airdrop: &Airdrop) {
        let current_time = clock::timestamp_ms(clock);
        assert!(current_time >= airdrop.start_time && current_time <= airdrop.end_time, EInvalidClaimTime);
    }

    public fun assert_no_remaining_shares(airdrop: &Airdrop) {
        assert!(airdrop.total_shares > airdrop.claimed_shares, ENoRemainingShares);
    }

    // === Testing ===

    #[test_only]
    entry fun init_for_test(ctx: &mut TxContext) {
        init(ctx);
    }
}