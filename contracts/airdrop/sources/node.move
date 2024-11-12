module airdrop::node {
    // === Imports ===

    use sui::vec_map::{Self, VecMap};
    use sui::coin::{Self, Coin};
    use airdrop::airdrop::{AdminCap};
    use airdrop::invite::{Self, Invite};

    // === Constants ===

    const MathBase: u64 = 10000;

    // === Errors ===

    // 异常: 余额不足
    const ECoinBalanceNotEnough: u64 = 5;
    // 异常: 已购买节点
    const EAlreadyBuyNode: u64 = 6;
    // 异常: 未购买节点
    // const ENotBuyNode: u64 = 7;
    // 异常: 节点已售罄
    const ENodeSoldOut: u64 = 8;

    // === Struct ===

    // 节点列表对象
    public struct Nodes has key, store {
        id: UID,
        // 节点信息: 等级 => Node对象
        nodes: VecMap<u8, Node>,
        // 用户信息: 用户地址 => 等级
        users: VecMap<address, u8>,
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
        // 总量
        total_quantity: u64,
        // 剩余数量
        remaining_quantity: u64,
    }

    /*
     * @notice 节点列表对象
     *
     * @param _admin_cap: AdminCap对象
     * @param root: root用户
     * @param inviter_fee: 邀请人费用
     */
    entry fun new(
        _admin_cap: &AdminCap,
        receiver: address,
        ctx: &mut TxContext
    ) {
        let node = Nodes {
            id: object::new(ctx),
            nodes: vec_map::empty(),
            users: vec_map::empty(),
            receiver,
        };
        transfer::public_share_object(node);
    }

    /*
     * @notice 增加节点
     *
     * @param _admin_cap: AdminCap对象
     * @param nodes: 节点列表对象
     * @param rank: 等级
     * @param name: 名称
     * @param description: 描述
     * @param limit: 每轮空投购买次数
     * @param price: 价格
     * @param total_quantity: 总数量
     */
    entry fun insert_node(
        _admin_cap: &AdminCap,
        nodes: &mut Nodes,
        rank: u8,
        name: vector<u8>,
        description: vector<u8>,
        limit: u64,
        price: u64,
        total_quantity: u64,
    ) {
        let node = Node {
            rank,
            name,
            description,
            limit,
            price,
            total_quantity,
            remaining_quantity: total_quantity
        };
        vec_map::insert(&mut nodes.nodes, rank, node);
    }

    /*
     * @notice 移除节点
     *
     * @param _admin_cap: AdminCap对象
     * @param nodes: 节点列表对象
     * @param rank: 等级
     */
    entry fun remove_node(
        _admin_cap: &AdminCap,
        nodes: &mut Nodes,
        rank: u8
    ) {
        vec_map::remove(&mut nodes.nodes, &rank);
    }

    /*
     * @notice 修改节点
     *
     * @param _admin_cap: AdminCap对象
     * @param nodes: 节点列表对象
     * @param rank: 等级
     * @param name: 名称
     * @param description: 描述
     * @param limit: 每轮空投购买次数
     * @param price: 价格
     * @param total_quantity: 总数量
     */
    entry fun modify_node(
        _admin_cap: &AdminCap,
        nodes: &mut Nodes,
        rank: u8,
        name: vector<u8>,
        description: vector<u8>,
        limit: u64,
        price: u64,
        total_quantity: u64,
    ) {
        let nodeMut: &mut Node = vec_map::get_mut(&mut nodes.nodes, &rank);
        nodeMut.rank = rank;
        nodeMut.name = name;
        nodeMut.description = description;
        nodeMut.limit = limit;
        nodeMut.price = price;
        nodeMut.total_quantity = total_quantity;
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
        nodes: &mut Nodes,
        invite: &Invite,
        rank: u8,
        mut wallet: Coin<T>,
        ctx: &mut TxContext,
    ) {
        let sender = tx_context::sender(ctx);
        invite::assert_not_bind_inviter(invite, sender);

        let node: &mut Node = vec_map::get_mut(&mut nodes.nodes, &rank);
        assert!(coin::value(&wallet) >= node.price, ECoinBalanceNotEnough);
        assert_already_buy_node(nodes.users, sender);
        assert_node_sold_out(node);

        // 更新用户信息
        vec_map::insert(&mut nodes.users, sender, node.rank);
        // 更新节点信息
        node.remaining_quantity = node.remaining_quantity - 1;

        // 处理多余的入金
        let excess_amount = coin::value(&wallet) - node.price;
        if (excess_amount > 0) {
            let excess_coin = coin::split(&mut wallet, excess_amount, ctx);
            transfer::public_transfer(excess_coin, sender);
        };

        // 处理剩余入金
        let inviter_rebate_value: u64 = node.price * MathBase / invite::inviter_fee(invite);
        let inviter_rebate = coin::split(&mut wallet, inviter_rebate_value, ctx);
        let inviter = invite::inviters(invite, sender);
        transfer::public_transfer(inviter_rebate, inviter);
        transfer::public_transfer(wallet, nodes.receiver);
    }

    public fun assert_already_buy_node(users: VecMap<address, u8>, sender: address) {
        assert!(vec_map::contains(&users, &sender), EAlreadyBuyNode);
    }

    public fun assert_node_sold_out(node: &Node) {
        assert!(node.remaining_quantity > 0, ENodeSoldOut);
    }
}