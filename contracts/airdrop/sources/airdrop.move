module airdrop::airdrop {
    // === Imports ===

    use sui::vec_map::{Self, VecMap};
    use sui::address::{Self};
    use sui::coin::{Self, Coin};
    use sui::balance::{Self, Balance};

    // === Constants ===

    const MathBase: u64 = 10000;

    // === Errors ===

    // 异常: root用户
    const ERootUser: u64 = 1;
    // 异常: 非法邀请人
    const EInvalidInviter: u64 = 2;
    // 异常: 已绑定邀请人
    const EAlreadyBindInviter: u64 = 3;
    // 异常: 未绑定邀请人
    const ENotBindInviter: u64 = 4;
    // 异常: 余额不足
    const ECoinBalanceNotEnough: u64 = 5;
    // 异常: 已购买节点
    const EAlreadyBuyNode: u64 = 6;
    // 异常: 未购买节点
    // const ENotBuyNode: u64 = 7;
    // 异常: 非法数量
    const EInvalidAmount: u64 = 8;
    // 异常: 轮次不存在
    const ERoundNotFound: u64 = 9;
    // 异常: 轮次已存在
    const ERoundExited: u64 = 10;
    // 异常: 节点已售罄
    const ENodeSoldOut: u64 = 11;

    // === Struct ===

    // 配置对象
    public struct Config has key, store {
        id: UID,
        // 节点信息: 等级 => Node对象
        nodes: VecMap<u8, Node>,
        // 邀请人信息: 用户地址 => 邀请人地址
        inviters: VecMap<address, address>,
        // 用户信息: 用户地址 => 等级
        users: VecMap<address, u8>,
        // 根用户
        root: address,
        // 邀请人费用, eg: 500 => 5%
        inviter_fee: u64,
        // 接收人
        receiver: address,
    }

    // 节点对象
    public struct Node has store, drop {
        // 等级
        rank: u8,
        // 名称
        name: vector<u8>,
        // 描述
        description: vector<u8>,
        // 每轮空投购买次数
        limit: u64,
        // 价格
        price: u64,
        // 数量
        quantity: u64,
    }

    // 空投列表对象
    public struct Airdrops<phantom T> has key, store {
        id: UID,
        airdrop: VecMap<u64, Airdrop<T>>,
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
        // 总资金
        total_balance: u64,
        // 资金
        treasury_balance: Balance<T>,
        // 是否开放
        is_open: bool,
    }

    // 管理员权限对象
    public struct AdminCap has key, store {
        id: UID,
    }


    fun init(ctx: &mut TxContext) {
        let sender = tx_context::sender(ctx);
        let admin_cap = AdminCap {
            id: object::new(ctx),
        };
        transfer::public_transfer(admin_cap, sender);
    }

    /*
     * @notice 创建配置对象
     *
     * @param _admin_cap: AdminCap对象
     * @param root: root用户
     * @param inviter_fee: 邀请人费用
     * @param receiver: 接收人
     */
    entry fun new_config(
        _admin_cap: &AdminCap,
        root: address,
        inviter_fee: u64,
        receiver: address,
        ctx: &mut TxContext
    ) {
        let config = Config {
            id: object::new(ctx),
            nodes: vec_map::empty(),
            inviters: vec_map::empty(),
            users: vec_map::empty(),
            root,
            inviter_fee,
            receiver,
        };
        transfer::public_share_object(config);
    }

    /*
     * @notice 修改配置对象
     *
     * @param _admin_cap: AdminCap对象
     * @param config: 配置对象
     * @param root: root用户
     * @param inviter_fee: 邀请人费用
     * @param receiver: 接收人
     */
    entry fun modify_config(
        _admin_cap: &AdminCap,
        config: &mut Config,
        root: address,
        inviter_fee: u64,
        receiver: address
    ) {
        config.root = root;
        config.inviter_fee = inviter_fee;
        config.receiver = receiver;
    }

    /*
     * @notice 创建空投对象
     *
     * @param T: 代币类型
     * @param _admin_cap: AdminCap对象
     */
    entry fun new_airdrops<T>(
        _admin_cap: &AdminCap,
        ctx: &mut TxContext
    ) {
        let airdrops = Airdrops<T> {
            id: object::new(ctx),
            airdrop: vec_map::empty(),
        };
        transfer::public_share_object(airdrops);
    }

    /*
     * @notice 邀请
     *
     * @param config: 配置对象
     * @param inviter: 邀请人地址
     *
     * aborts-if:
     * - 调用人是根用户.
     * - 邀请人是调用人.
     * - 调用人重复绑定
     */
    entry fun invite(config: &mut Config, inviter: address, ctx: &TxContext) {
        let sender = tx_context::sender(ctx);
        assert!(!(&sender == &config.root), ERootUser);
        assert!(!(&sender == &inviter), EInvalidInviter);
        assert!(!vec_map::contains(&config.inviters, &sender), EAlreadyBindInviter);
        vec_map::insert(&mut config.inviters, sender, inviter);
    }

    /*
     * @notice 获取邀请人
     *
     * @param config: 配置对象
     * @param user: 用户地址
     * @return 邀请人地址
     */
    public fun get_inviter(config: &Config, user: address): address {
        if (vec_map::contains(&config.inviters, &user)) {
            let iniviter: &address = vec_map::get(&config.inviters, &user);
            *iniviter
        } else {
            address::from_u256(0)
        }
    }

    /*
     * @notice 增加节点
     *
     * @param _admin_cap: AdminCap对象
     * @param config: 配置对象
     * @param rank: 等级
     * @param name: 名称
     * @param description: 描述
     * @param limit: 每轮空投购买次数
     * @param price: 价格
     * @param quantity: 数量
     */
    entry fun insert_node(
        _admin_cap: &AdminCap,
        config: &mut Config,
        rank: u8,
        name: vector<u8>,
        description: vector<u8>,
        limit: u64,
        price: u64,
        quantity: u64,
    ) {
        let node = Node {
            rank,
            name,
            description,
            limit,
            price,
            quantity,
        };
        vec_map::insert(&mut config.nodes, rank, node);
    }

    /*
     * @notice 移除节点
     *
     * @param _admin_cap: AdminCap对象
     * @param config: 配置对象
     * @param rank: 等级
     */
    entry fun remove_node(
        _admin_cap: &AdminCap,
        config: &mut Config,
        rank: u8
    ) {
        vec_map::remove(&mut config.nodes, &rank);
    }

    /*
     * @notice 修改节点
     *
     * @param _admin_cap: AdminCap对象
     * @param config: 配置对象
     * @param rank: 等级
     * @param name: 名称
     * @param description: 描述
     * @param limit: 每轮空投购买次数
     * @param price: 价格
     * @param quantity: 数量
     */
    entry fun modify_node(
        _admin_cap: &AdminCap,
        config: &mut Config,
        rank: u8,
        name: vector<u8>,
        description: vector<u8>,
        limit: u64,
        price: u64,
        quantity: u64,
    ) {
        let nodeMut: &mut Node = vec_map::get_mut(&mut config.nodes, &rank);
        nodeMut.rank = rank;
        nodeMut.name = name;
        nodeMut.description = description;
        nodeMut.limit = limit;
        nodeMut.price = price;
        nodeMut.quantity = quantity;
    }

    /*
     * @notice 购买节点
     *
     * @param T: 代币类型
     * @param config: 配置对象
     * @param rank: 等级
     * @param wallet: 支付的代币对象
     *
     * aborts-if:
     * - 调用人没有绑定邀请人
     * - 调用人支付资金不足
     * - 调用人重复购买节点
     * - 节点已售罄
     */
    entry fun buy_node<T>(
        config: &mut Config,
        rank: u8,
        mut wallet: Coin<T>,
        ctx: &mut TxContext,
    ) {
        let sender = tx_context::sender(ctx);
        assert!(vec_map::contains(&config.inviters, &sender), ENotBindInviter);

        let node: &mut Node = vec_map::get_mut(&mut config.nodes, &rank);
        assert!(coin::value(&wallet) >= node.price, ECoinBalanceNotEnough);
        assert!(vec_map::contains(&config.users, &sender), EAlreadyBuyNode);
        assert!(node.quantity > 0, ENodeSoldOut);

        // 更新用户信息
        vec_map::insert(&mut config.users, sender, node.rank);
        // 更新节点信息
        node.quantity = node.quantity - 1;

        // 处理多余的入金
        let excess_amount = coin::value(&wallet) - node.price;
        if (excess_amount > 0) {
            let excess_coin = coin::split(&mut wallet, excess_amount, ctx);
            transfer::public_transfer(excess_coin, sender);
        };

        // 处理剩余入金
        let inviter_rebate_value: u64 = node.price * MathBase / config.inviter_fee;
        let inviter_rebate = coin::split(&mut wallet, inviter_rebate_value, ctx);
        let inviter: &address = vec_map::get(&config.inviters, &sender);
        transfer::public_transfer(inviter_rebate, *inviter);
        transfer::public_transfer(wallet, config.receiver);
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
        airdrops: &mut Airdrops<T>,
        round: u64,
        start_time: u64,
        end_time: u64,
        total_shares: u64,
        total_balance: u64,
        mut wallet: Coin<T>,
        ctx: &mut TxContext,
    ) {
        assert!(coin::value(&wallet) >= total_balance, EInvalidAmount);
        assert!(!vec_map::contains(&airdrops.airdrop, &round), ERoundExited);

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
            total_balance,
            treasury_balance: coin::into_balance(wallet),
            is_open: true,
        };
        vec_map::insert(&mut airdrops.airdrop, round, aidrop);
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
        airdrops: &mut Airdrops<T>,
        round: u64,
        start_time: u64,
        end_time: u64,
        is_open: bool,
    ) {
        assert!(vec_map::contains(&airdrops.airdrop, &round), ERoundNotFound);
        let aidrop: &mut Airdrop<T> = vec_map::get_mut(&mut airdrops.airdrop, &round);
        aidrop.start_time = start_time;
        aidrop.end_time = end_time;
        aidrop.is_open = is_open;
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
        airdrops: &mut Airdrops<T>,
        round: u64,
        ctx: &mut TxContext
    ) {
        assert!(vec_map::contains(&airdrops.airdrop, &round), ERoundNotFound);
        let aidrop: &mut Airdrop<T> = vec_map::get_mut(&mut airdrops.airdrop, &round);
        let sender = tx_context::sender(ctx);
        let treasury_balance = balance::withdraw_all(&mut aidrop.treasury_balance);
        let treasury_coin = coin::from_balance(treasury_balance, ctx);
        transfer::public_transfer(treasury_coin, sender);
    }

    public(package) fun root(config: &Config): address {
        config.root
    }

    public(package) fun inviter_fee(config: &Config): u64 {
        config.inviter_fee
    }

    public(package) fun receiver(config: &Config): address {
        config.receiver
    }

    #[test_only]
    entry fun init_for_test(ctx: &mut TxContext) {
        init(ctx);
    }
}