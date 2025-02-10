module airdrop::node {
    // === Imports ===

    use sui::vec_map::{Self, VecMap};
    use sui::coin::{Coin};
    use sui::event::{Self};
    use std::type_name::{Self, TypeName};
    use airdrop::global::Global;
    use airdrop::invite::{Self, Invite};
    use airdrop::invest::{Self, Invest};
    use airdrop::limit::{Self, Limits};

    // === Constants ===

    const MathBase: u64 = 10000;

    // === Errors ===

    // 异常: 余额不足
    const ECoinBalanceNotEnough: u64 = 1;
    // 异常: 已购买权益
    #[allow(unused_const)]
    const EAlreadyBuyNode: u64 = 2;
    // 异常: 未购买权益
    #[allow(unused_const)]
    const ENotBuyNode: u64 = 3;
    // 异常: 权益已售罄
    const ENodeSoldOut: u64 = 4;
    // 异常: 超出购买限额
    const EExceedsPurchaseLimit: u64 = 5;
    // 异常: 非法代币类型
    const EInvalidCoinType: u64 = 6;
    // 异常：权益未开启
    const ENodeNotOpen: u64 = 7;
    // 异常: 剩余次数不足
    const EInsufficientRemainingQuantity: u64 = 8;
    // 异常：方法已弃用
    const EMethodDeprecated: u64 = 9;
    // 异常: 不需要购买权益
    const ENoNeedBuyNode: u64 = 10;
    // 异常: 需要购买权益
    const EMustBuyNode: u64 = 11;

    // === Struct ===

    // 权益列表对象
    public struct Nodes has key, store {
        id: UID,
        // 权益信息: 等级 => Node对象
        nodes: VecMap<u8, Node>,
        // 用户信息: 用户地址 => 等级
        users: VecMap<address, User>,
        // 接收人
        receiver: address,
        // 代币类型
        coin_type: TypeName,
        // 权益编号
        node_index: u8,
        // 权益序号
        node_num_index: u64,
        // 已领取空投数量：权益序号 => 轮次 => 次数
        limits: VecMap<u64, VecMap<u64, u64>>
    }

    // 权益对象
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
        // 是否开启
        is_open: bool,
    }

    public struct User has store {
        // 等级
        rank: u8,
        // 权益序列号
        node_num: u64,
        // 注：实际上是"是否合法", 而不是"是否非法"(此处为命名错误)
        is_invalid: bool,
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
        // 是否开启
        is_open: bool,
    }

    // === Event ===

    // 权益对象变更
    public struct NodeChange has copy, drop {
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
        // 是否开启
        is_open: bool,
        // 是否移除
        is_remove: bool,
    }

    #[allow(unused_field)]
    public struct Buy has copy, drop {
        // 用户
        sender: address,
        // 权益等级
        rank: u8,
        // 权益序号
        node_num: u64,
    }

    public struct BuyV2 has copy, drop {
        // 用户
        sender: address,
        // 权益等级
        rank: u8,
        // 权益序号
        node_num: u64,
        // 支付金额
        payment_amount: u64,
        // 邀请人返利金额
        inviter_gains: u64,
        // 平台返利金额
        node_receiver_gains: u64,
    }

    public struct Transfer has copy, drop {
        // 用户
        sender: address,
        // 接收人
        receiver: address,
        // 权益等级
        rank: u8,
        // 权益序号
        node_num: u64,
    }

    /*
     * @notice 创建nodes对象
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
     * @notice 增加权益
     *
     * @param nodes: 权益列表对象
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
            purchased_quantity: 0,
            is_open: true,
        };

        event::emit(NodeChange {
            rank: node.rank,
            name: node.name,
            description: node.description,
            limit: node.limit,
            price: node.price,
            total_quantity: node.total_quantity,
            purchased_quantity: node.purchased_quantity,
            is_open: node.is_open,
            is_remove: false
        });

        nodes.nodes.insert(rank, node);
    }

    /*
     * @notice 移除权益
     *
     * @param nodes: 权益列表对象
     * @param rank: 等级
     */
    public(package) fun remove(
        nodes: &mut Nodes,
        rank: u8
    ) {
        let node = nodes.nodes.get(&rank);

        event::emit(NodeChange {
            rank: node.rank,
            name: node.name,
            description: node.description,
            limit: node.limit,
            price: node.price,
            total_quantity: node.total_quantity,
            purchased_quantity: node.purchased_quantity,
            is_open: node.is_open,
            is_remove: true
        });

        nodes.nodes.remove(&rank);
    }

    /*
     * @notice 修改权益
     *
     * @param nodes: 权益列表对象
     * @param rank: 等级
     * @param name: 名称
     * @param description: 描述
     * @param price: 价格
     * @param is_open: 是否开启
     */
    public(package) fun modify(
        nodes: &mut Nodes,
        rank: u8,
        name: vector<u8>,
        description: vector<u8>,
        price: u64,
        limit: u64,
        total_quantity: u64,
        is_open: bool,
    ) {
        let node: &mut Node = nodes.nodes.get_mut(&rank);

        node.rank = rank;
        node.name = name;
        node.description = description;
        node.price = price;
        node.limit = limit;
        node.total_quantity = total_quantity;
        node.is_open = is_open;

        event::emit(NodeChange {
            rank: node.rank,
            name: node.name,
            description: node.description,
            limit: node.limit,
            price: node.price,
            total_quantity: node.total_quantity,
            purchased_quantity: node.purchased_quantity,
            is_open: node.is_open,
            is_remove: false
        });
    }

    /*
     * @notice 修改权益列表
     *
     * @param T: 购买权益货币类型
     * @param receiver: 购买权益费用接收人
     */
    public(package) fun modify_nodes<T>(nodes: &mut Nodes, receiver: address) {
        nodes.receiver = receiver;
        nodes.coin_type = type_name::get<T>();
    }

    // 更新某个权益在某个回合购买次数
    public(package) fun update_purchased_quantity(nodes: &mut Nodes, sender: address, round: u64) {
        assert_no_need_buy_node(nodes, sender);
        let user: &mut User = nodes.users.get_mut(&sender);
        let mut quantity: u64 = 1;

        // 此权益是否领取过空投
        let is_exists = nodes.limits.contains(&user.node_num);
        if (is_exists) {
            let round_map_times = nodes.limits.get_mut(&user.node_num);

            // 此权益是否领取过当前轮空投
            let is_exists = round_map_times.contains(&round);
            if (is_exists) {
                let user_purchased_quantity: &u64 = round_map_times.get(&round);
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
     * @notice 购买权益
     *
     * @param T: 代币类型
     * @param nodes: nodes对象
     * @param rank: 等级
     * @param wallet: 支付的代币对象
     */
    #[allow(unused_let_mut, unused_type_parameter)]
    entry fun buy<T>(
        _nodes: &mut Nodes,
        _invite: &Invite,
        _rank: u8,
        mut wallet: Coin<T>,
        ctx: &TxContext,
    ) {
        let sender = tx_context::sender(ctx);
        transfer::public_transfer(wallet, sender);
        assert!(false, EMethodDeprecated);
    }

    entry fun buy_v2<T>(
        nodes: &mut Nodes,
        invite: &Invite,
        rank: u8,
        mut wallet: Coin<T>,
        invest: &mut Invest,
        global: &Global,
        ctx: &mut TxContext,
    ) {
        global.assert_pause();
        global.assert_object_invalid(nodes.uid());
        global.assert_object_invalid(invite.uid());

        let sender = tx_context::sender(ctx);

        // 断言：需要合法的代币类型
        assert_invalid_coin_type<T>(nodes.coin_type);
        // 断言：需要已绑定邀请关系
        invite::assert_not_bind_inviter(invite, sender);
        // 断言：需要购买权益
        assert_no_need_buy_node(nodes, sender);

        nodes.node_num_index = nodes.node_num_index + 1;
        let node: &mut Node = nodes.nodes.get_mut(&rank);

        // 断言：需要足够的代币余额
        assert!(wallet.value() >= node.price, ECoinBalanceNotEnough);
        // 断言：需要权益未售罄
        assert_node_sold_out(node);
        // 断言：需要权益开放购买
        assert_node_not_open(node);

        let is_exists = nodes.users.contains(&sender);
        if (is_exists) {
            // 如果用户已存在，用新编号的权益更新
            let user = nodes.users.get_mut(&sender);
            user.rank = rank;
            user.node_num = nodes.node_num_index;
            // 注：实际上是"是否合法", 而不是"是否非法"(此处为命名错误)
            user.is_invalid = true;
        } else {
            let user = User {
                rank: node.rank,
                node_num: nodes.node_num_index,
                // 注：实际上是"是否合法", 而不是"是否非法"(此处为命名错误)
                is_invalid: true,
            };
            nodes.users.insert(sender, user);
        };

        // 更新权益信息
        node.purchased_quantity = node.purchased_quantity + 1;

        // 处理多余的入金
        let excess_amount = wallet.value() - node.price;
        if (excess_amount > 0) {
            let excess_coin = wallet.split(excess_amount, ctx);
            transfer::public_transfer(excess_coin, sender);
        };

        // 处理剩余入金
        let inviter_rebate_value: u64 = node.price * invite::inviter_fee(invite) / MathBase;
        let receiver_rebate_value: u64 = wallet.value() - inviter_rebate_value;
        let inviter_rebate = wallet.split(inviter_rebate_value, ctx);
        let inviter = invite::inviters(invite, sender);
        transfer::public_transfer(inviter_rebate, inviter);
        transfer::public_transfer(wallet, nodes.receiver);

        event::emit(BuyV2 {
            sender,
            rank,
            node_num: nodes.node_num_index,
            payment_amount: node.price,
            inviter_gains: inviter_rebate_value,
            node_receiver_gains: receiver_rebate_value,
        });

        // 更新用户投资
        invest::update_invest(invest, sender, node.price);

        // 更新邀请人收益
        let is_need_forbiden = invest::update_gains(invest, inviter, inviter_rebate_value);
        if (is_need_forbiden) {
            forbiden(nodes, inviter);
        };
    }

    entry fun transfer(
        _nodes: &mut Nodes,
        _receiver: address,
        _ctx: &TxContext,
    ) {
        assert!(false, EMethodDeprecated);
    }

    /*
     * @notice 转移权益
     */
    entry fun transfer_v2(
        nodes: &mut Nodes,
        receiver: address,
        global: &Global,
        ctx: &TxContext,
    ) {
        global.assert_pause();
        global.assert_object_invalid(nodes.uid());

        let sender = tx_context::sender(ctx);
        let rank = nodes_rank(nodes, sender);
        let node = nodes.nodes.get(&rank);

        // 权益发送人必须已购买权益
        assert_no_need_buy_node(nodes, sender);
        // 权益接收人必须未拥有权益
        assert_must_buy_node(nodes, receiver);

        let node_sender: &mut User = nodes.users.get_mut(&sender);
        let node_num: u64 = node_sender.node_num;

        // 更新权益发送人信息
        node_sender.rank = 0;
        node_sender.node_num = 0;
        node_sender.is_invalid = false;

        let is_exists = nodes.users.contains(&receiver);
        // 更新权益接收人信息
        if (is_exists) {
            let node_receiver: &mut User = nodes.users.get_mut(&receiver);
            node_receiver.rank = rank;
            node_receiver.node_num = node_num;
            // 注：实际上是"是否合法", 而不是"是否非法"(此处为命名错误)
            node_receiver.is_invalid = true;
        }
        else {
            let node_receiver = User {
                rank: node.rank,
                node_num,
                // 注：实际上是"是否合法", 而不是"是否非法"(此处为命名错误)
                is_invalid: true,
            };
            nodes.users.insert(receiver, node_receiver);
        };

        event::emit(Transfer {
            sender,
            receiver,
            rank,
            node_num,
        })
    }

    public(package) fun forbiden(nodes: &mut Nodes, address: address) {
        let is_exists = nodes.users.contains(&address);
        if (is_exists) {
            let user: &mut User = nodes.users.get_mut(&address);
            // 注：实际上是"是否合法", 而不是"是否非法"(此处为命名错误)
            user.is_invalid = true;
        } else {
            let user = User {
                rank: 0,
                node_num: 0,
                // 注：实际上是"是否合法", 而不是"是否非法"(此处为命名错误)
                is_invalid: true,
            };
            nodes.users.insert(address, user);
        }
    }

    public fun receiver(nodes: &Nodes): address {
        nodes.receiver
    }

    public fun nodes_rank(nodes: &Nodes, sender: address): u8 {
        let user_info = nodes.users.get(&sender);
        user_info.rank
    }

    public fun remaining_quantity_of_claim(_nodes: &Nodes, _sender: address, _round: u64): u64 {
        assert!(false, EMethodDeprecated);
        0
    }

    public fun remaining_quantity_of_claim_v2(
        nodes: &Nodes,
        sender: address,
        round: u64,
        limits: &Limits
    ): u64 {
        // 是否绑定邀请关系
        let is_exists = nodes.users.contains(&sender);
        if (is_exists) {
            let user: &User = nodes.users.get(&sender);

            // 是否购买权益
            let is_exists = nodes.nodes.contains(&user.rank);
            if (is_exists) {
                let node: &Node = nodes.nodes.get(&user.rank);
                // 可领取次数，从权益模板获取，不从权益实体获取。
                let node_limit_quantity = node.limit;

                // 此权益是否领取过空投
                let is_exists = nodes.limits.contains(&user.node_num);
                if (is_exists) {
                    let round_map_times = nodes.limits.get(&user.node_num);

                    // 此权益是否领取过当前轮空投
                    let is_exists = round_map_times.contains(&round);
                    if (is_exists) {
                        let user_purchased_quantity: &u64 = round_map_times.get(&round);

                        // 计算特殊限制
                        limit::special_limit_remaining_quantity(
                            limits,
                            &sender,
                            node_limit_quantity,
                            *user_purchased_quantity
                        )
                    } else {
                        // 计算特殊限制
                        limit::special_limit_remaining_quantity(
                            limits,
                            &sender,
                            node_limit_quantity,
                            0
                        )
                    }
                } else {
                    // 计算特殊限制
                    limit::special_limit_remaining_quantity(
                        limits,
                        &sender,
                        node_limit_quantity,
                        0
                    )
                }
            } else {
                0
            }
        } else {
            0
        }
    }

    public fun is_already_buy_node(_nodes: &Nodes, _sender: address): bool {
        assert!(false, EMethodDeprecated);
        false
    }

    public fun is_need_buy_node(nodes: &Nodes, sender: address): bool {
        // 未拥有，需要购买
        // 被禁用，需要购买
        let owns = is_owns(nodes, sender);
        if (owns) {
            is_forbidden(nodes, sender)
        } else {
            true
        }
    }

    public fun is_owns(nodes: &Nodes, sender: address): bool {
        // 在列表中、权益等级不为0且用户不非法，则为拥有权益
        let is_exists = nodes.users.contains(&sender);
        if (is_exists) {
            let user: &User = nodes.users.get(&sender);
            // 注：实际上是"是否合法", 而不是"是否非法"(此处为命名错误)
            user.rank != 0 && !user.is_invalid
        } else {
            false
        }
    }

    public fun is_forbidden(nodes: &Nodes, sender: address): bool {
        // 在列表中，权益等级不为0且非法权益，则为禁用
        let is_exists = nodes.users.contains(&sender);
        if (is_exists) {
            let user: &User = nodes.users.get(&sender);
            // 注：实际上是"是否合法", 而不是"是否非法"(此处为命名错误)
            user.rank != 0 && user.is_invalid
        } else {
            false
        }
    }

    public fun node_list(nodes: &Nodes) {
        let length = nodes.nodes.size() as u8;
        let mut i: u8 = 1;
        while (i < length + 1) {
            let node = nodes.nodes.get(&i);
            event::emit(NodeInfo {
                rank: node.rank,
                name: node.name,
                description: node.description,
                limit: node.limit,
                price: node.price,
                total_quantity: node.total_quantity,
                purchased_quantity: node.purchased_quantity,
                is_open: node.is_open,
            });
            i = i + 1;
        };
    }

    public fun uid(self: &Nodes) :&UID {
        &self.id
    }

    // === Assertions ===

    public fun assert_already_buy_node(_users: &VecMap<address, User>, _sender: address) {
        assert!(false, EMethodDeprecated);
    }

    public fun assert_no_need_buy_node(nodes: &Nodes, sender: address) {
        // 断言：需要购买权益
        let is_exists = is_need_buy_node(nodes, sender);
        assert!(is_exists, ENoNeedBuyNode);
    }

    public fun assert_not_buy_node(_users: &VecMap<address, User>, _sender: address) {
        assert!(false, EMethodDeprecated);
    }

    public fun assert_must_buy_node(nodes: &Nodes, sender: address) {
        // 断言：不需要购买权益
        let is_exists = is_need_buy_node(nodes, sender);
        assert!(!is_exists, EMustBuyNode);
    }

    public fun assert_node_sold_out(node: &Node) {
        assert!(node.total_quantity - node.purchased_quantity > 0, ENodeSoldOut);
    }

    public fun assert_exceeds_purchase_limit(node: &Node, purchased_quantity: u64) {
        assert!(node.limit - purchased_quantity > 0, EExceedsPurchaseLimit);
    }

    public fun assert_invalid_coin_type<T>(coin_type: TypeName) {
        // 代币类型是否正确
        assert!(type_name::get<T>() == coin_type, EInvalidCoinType);
    }

    public fun assert_node_not_open(node: &Node) {
        assert!(node.is_open, ENodeNotOpen);
    }

    public fun assert_insufficient_remaining_quantity(
        nodes: &Nodes,
        sender: address,
        round: u64,
        limits: &Limits,
    ) {
        let times = remaining_quantity_of_claim_v2(
            nodes,
            sender,
            round,
            limits
        );
        assert!(times > 0, EInsufficientRemainingQuantity);
    }
}