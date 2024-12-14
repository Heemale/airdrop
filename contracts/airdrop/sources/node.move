module airdrop::node {
    // === Imports ===

    use sui::vec_map::{Self, VecMap};
    use sui::coin::{Self, Coin};
    use sui::event;
    use airdrop::invite::{Self, Invite};
    use std::type_name::{Self, TypeName};
    // === Constants ===

    const MathBase: u64 = 10000;

    // === Errors ===

    // 异常: 余额不足
    const ECoinBalanceNotEnough: u64 = 1;
    // 异常: 已购买节点
    const EAlreadyBuyNode: u64 = 2;
    // 异常: 未购买节点
    const ENotBuyNode: u64 = 3;
    // 异常: 节点已售罄
    const ENodeSoldOut: u64 = 4;
    // 异常: 超出购买限额
    const EExceedsPurchaseLimit: u64 = 5;
    // 异常: 非法代币类型
    const EInvalidCoinType: u64 = 6;

    // === Struct ===

    // 节点列表对象
    public struct Nodes has key, store {
        id: UID,
        // 节点信息: 等级 => Node对象
        nodes: VecMap<u8, Node>,
        // 用户信息: 用户地址 => 等级
        users: VecMap<address, User>,
        // 接收人
        receiver: address,
        // 代币类型
        coin_type: TypeName,
        // 节点编号
        node_index: u8,
        // 节点序号
        node_num_index: u64,
        // 已领取空投数量：节点序号 => 轮次 => 次数
        limits: VecMap<u64, VecMap<u64, u64>>
    }

    // 节点对象
    public struct Node has store, drop {
        // 等级
        rank: u8,
        // 名称
        name: vector<u8>,
        // 描述
        description: vector<u8>,
        // 每轮可领取空投数量
        limit: u64,
        // 价格
        price: u64,
        // 总量
        total_quantity: u64,
        // 已购买的数量
        purchased_quantity: u64,
    }

    public struct User has store {
        // 等级
        rank: u8,
        // 节点序列号
        node_num: u64,
        // 是否合法
        is_invalid: bool
    }

    public struct NodeInfo has copy, drop {
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
        // 已购买的数量
        purchased_quantity: u64,
    }

    /*
     * @notice 节点列表对象
     *
     * @param root: root用户
     * @param inviter_fee: 邀请人费用
     */
    public(package) fun new<T>(
        receiver: address,
        ctx: &mut TxContext
    ) {
        let node = Nodes {
            id: object::new(ctx),
            nodes: vec_map::empty(),
            users: vec_map::empty(),
            receiver,
            coin_type: type_name::get<T>(),
            node_index: 0,
            node_num_index: 0,
            limits: vec_map::empty(),
        };
        transfer::public_share_object(node);
    }

    /*
     * @notice 增加节点
     *
     * @param nodes: 节点列表对象
     * @param rank: 等级
     * @param name: 名称
     * @param description: 描述
     * @param limit: 每轮空投购买次数
     * @param price: 价格
     * @param total_quantity: 总数量
     */
    public(package) fun insert(
        nodes: &mut Nodes,
        name: vector<u8>,
        description: vector<u8>,
        limit: u64,
        price: u64,
        total_quantity: u64,
    ) {
        nodes.node_index = nodes.node_index + 1;
        let rank = nodes.node_index;
        let node = Node {
            rank,
            name,
            description,
            limit,
            price,
            total_quantity,
            purchased_quantity: 0
        };
        vec_map::insert(&mut nodes.nodes, rank, node);
    }

    /*
     * @notice 移除节点
     *
     * @param nodes: 节点列表对象
     * @param rank: 等级
     */
    public(package) fun remove(
        nodes: &mut Nodes,
        rank: u8
    ) {
        vec_map::remove(&mut nodes.nodes, &rank);
    }

    /*
     * @notice 修改节点
     *
     * @param nodes: 节点列表对象
     * @param rank: 等级
     * @param name: 名称
     * @param description: 描述
     * @param limit: 每轮空投购买次数
     * @param price: 价格
     * @param total_quantity: 总数量
     */
    public(package) fun modify(
        nodes: &mut Nodes,
        rank: u8,
        name: vector<u8>,
        description: vector<u8>,
        price: u64,
    ) {
        let nodeMut: &mut Node = vec_map::get_mut(&mut nodes.nodes, &rank);
        nodeMut.rank = rank;
        nodeMut.name = name;
        nodeMut.description = description;
        nodeMut.price = price;
    }

    // 更新某个节点在某个回合购买次数
    public(package) fun update_purchased_quantity(nodes: &mut Nodes, sender: address, round: u64) {
        assert_not_buy_node(&nodes.users, sender);
        let user: &mut User = vec_map::get_mut(&mut nodes.users, &sender);
        let mut quantity: u64 = 1;

        // 此节点是否领取过空投
        let is_exists = vec_map::contains(&nodes.limits, &user.node_num);
        if (is_exists) {
            let round_map_times = vec_map::get_mut(&mut nodes.limits, &user.node_num);

            // 此节点是否领取过当前轮空投
            let is_exists = vec_map::contains(round_map_times, &round);
            if (is_exists) {
                let user_purchased_quantity: &u64 = vec_map::get(round_map_times, &round);
                quantity = *user_purchased_quantity + 1;
                round_map_times.remove(&round);
                round_map_times.insert(round, quantity);
            } else {
                round_map_times.insert(round, quantity);
            }
        } else {
            let mut round_map_times = vec_map::empty<u64, u64>();
            round_map_times.insert(round, quantity);
            nodes.limits.insert(user.node_num, round_map_times);
        }
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
    entry fun buy<T>(
        nodes: &mut Nodes,
        invite: &Invite,
        rank: u8,
        mut wallet: Coin<T>,
        ctx: &mut TxContext,
    ) {
        assert_invalid_coin_type<T>(nodes.coin_type);

        let sender = tx_context::sender(ctx);
        invite::assert_not_bind_inviter(invite, sender);
        nodes.node_num_index = nodes.node_num_index + 1;

        let node: &mut Node = vec_map::get_mut(&mut nodes.nodes, &rank);
        assert!(coin::value(&wallet) >= node.price, ECoinBalanceNotEnough);
        assert_already_buy_node(&nodes.users, sender);
        assert_node_sold_out(node);

        // 更新用户信息
        let user = User {
            rank: node.rank,
            node_num: nodes.node_num_index,
            is_invalid: true,
        };
        vec_map::insert(&mut nodes.users, sender, user);

        // 更新节点信息
        node.purchased_quantity = node.purchased_quantity + 1;

        // 处理多余的入金
        let excess_amount = coin::value(&wallet) - node.price;
        if (excess_amount > 0) {
            let excess_coin = coin::split(&mut wallet, excess_amount, ctx);
            transfer::public_transfer(excess_coin, sender);
        };

        // 处理剩余入金
        let inviter_rebate_value: u64 = node.price * invite::inviter_fee(invite) / MathBase;
        let inviter_rebate = coin::split(&mut wallet, inviter_rebate_value, ctx);
        let inviter = invite::inviters(invite, sender);
        transfer::public_transfer(inviter_rebate, inviter);
        transfer::public_transfer(wallet, nodes.receiver);
    }

    entry fun transfer(
        nodes: &mut Nodes,
        receiver: address,
        ctx: &TxContext,
    ) {
        let sender = tx_context::sender(ctx);
        let rank = nodes_rank(nodes, sender);
        let node = vec_map::get(&nodes.nodes, &rank);

        // 节点发送人必须已购买节点
        assert_not_buy_node(&nodes.users, sender);
        // 节点接收人必须未拥有节点
        assert_already_buy_node(&nodes.users, receiver);

        let node_sender: &mut User = vec_map::get_mut(&mut nodes.users, &sender);
        let node_num: u64 = node_sender.node_num;
        // 更新节点发送人信息
        node_sender.rank = 0;
        node_sender.node_num = 0;
        node_sender.is_invalid = false;

        let is_exists = vec_map::contains(&nodes.users, &receiver);
        // 更新节点接收人信息
        if (is_exists) {
            let node_receiver: &mut User = vec_map::get_mut(&mut nodes.users, &receiver);
            node_receiver.rank = rank;
            node_receiver.node_num = node_num;
            node_receiver.is_invalid = true;
        }
        else {
            let node_receiver = User {
                rank: node.rank,
                node_num,
                is_invalid: true,
            };
            vec_map::insert(&mut nodes.users, receiver, node_receiver);
        };
    }

    public fun receiver(nodes: &Nodes): address {
        nodes.receiver
    }

    public fun nodes_rank(nodes: &Nodes, sender: address): u8 {
        let user_info = vec_map::get(&nodes.users, &sender);
        user_info.rank
    }

    public fun remaining_quantity_of_claim(nodes: &Nodes, sender: address, round: u64): u64 {
        // 是否绑定邀请关系
        let is_exists = vec_map::contains(&nodes.users, &sender);
        if (is_exists) {
            let user: &User = vec_map::get(&nodes.users, &sender);

            // 是否购买节点
            let is_exists = vec_map::contains(&nodes.nodes, &user.rank);
            if (is_exists) {
                let node: &Node = vec_map::get(&nodes.nodes, &user.rank);
                let node_purchased_quantity = node.limit;

                // 此节点是否领取过空投
                let is_exists = vec_map::contains(&nodes.limits, &user.node_num);
                if (is_exists) {
                    let round_map_times = vec_map::get(&nodes.limits, &user.node_num);

                    // 此节点是否领取过当前轮空投
                    let is_exists = vec_map::contains(round_map_times, &round);
                    if (is_exists) {
                        let user_purchased_quantity: &u64 = vec_map::get(round_map_times, &round);
                        node_purchased_quantity - *user_purchased_quantity
                    } else {
                        node_purchased_quantity
                    }
                } else {
                    node_purchased_quantity
                }
            } else {
                0
            }
        } else {
            0
        }
    }

    public fun is_already_buy_node(nodes: &Nodes, sender: address): bool {
        let is_exists = vec_map::contains(&nodes.users, &sender);
        if (is_exists) {
            let user: &User = vec_map::get(&nodes.users, &sender);
            user.is_invalid
        } else {
            false
        }
    }

    public fun node_list(nodes: &Nodes) {
        let length = vec_map::size(&nodes.nodes) as u8;
        let mut i: u8 = 1;
        while (i < length + 1) {
            let node = vec_map::get(&nodes.nodes, &i);
            event::emit(NodeInfo {
                rank: node.rank,
                name: node.name,
                description: node.description,
                limit: node.limit,
                price: node.price,
                total_quantity: node.total_quantity,
                purchased_quantity: node.purchased_quantity,
            });
            i = i + 1;
        };
    }

    // === Assertions ===

    public fun assert_already_buy_node(users: &VecMap<address, User>, sender: address) {
        // 必须满足以下条件任意一个，否则abort
        // 1.不存在数组中
        // 2.存在数组中，但is_invalid为false
        let is_exists = vec_map::contains(users, &sender);
        assert!(!is_exists, EAlreadyBuyNode);
        if (is_exists) {
            let user: &User = vec_map::get(users, &sender);
            assert!(!user.is_invalid, EAlreadyBuyNode);
        }
    }

    public fun assert_not_buy_node(users: &VecMap<address, User>, sender: address) {
        // 必须满足以下条件任意一个，否则abort
        // 1.存在数组中，且is_invalid为true
        let is_exists = vec_map::contains(users, &sender);
        if (is_exists) {
            let user: &User = vec_map::get(users, &sender);
            assert!(user.is_invalid, ENotBuyNode);
        }
    }

    public fun assert_node_sold_out(node: &Node) {
        assert!(node.total_quantity - node.purchased_quantity > 0, ENodeSoldOut);
    }

    public fun assert_exceeds_purchase_limit(node: &Node, purchased_quantity: u64) {
        assert!(node.limit - purchased_quantity > 0, EExceedsPurchaseLimit);
    }

    public fun assert_invalid_coin_type<T>(coin_type: TypeName) {
        assert!(type_name::get<T>() == coin_type, EInvalidCoinType);
    }
}