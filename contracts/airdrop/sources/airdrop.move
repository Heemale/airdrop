module airdrop::airdrop {
<<<<<<< HEAD
    use sui::vec_map::{Self, VecMap};
=======
    // === Imports ===

    use sui::object_bag::{Self, ObjectBag};
>>>>>>> 01c32e3142fb3e3ffbfd175b38c468342a717bb4
    use sui::coin::{Self, Coin};
    use sui::address::{Self};
    use sui::balance::{Self, Balance};
    use sui::event;
    use sui::clock::{Self, Clock};
    use sui::object_bag::{Self, ObjectBag};
    
    // 异常: root用户
    const ERoot: u64 = 1001;
    // 异常: 绑定自己
    const EInviteSelf: u64 = 1002;
    // 异常: 已绑定
    const EInvited: u64 = 1003;

    // 异常: 节点已售罄
    const ENodeSoldOut: u64 = 1005;
    // 异常: 未绑定
    const ENotInvited: u64 = 1006;
    // 异常: 价格不足
    const ETokenNotSet: u64 = 1007;
    // 新增异常：已购买节点
    const EAlreadyPurchased: u64 = 1008;
    // 异常: 空投已结束
    const EInvalidAirDrop : u64 = 1009;
    // 已经领取
    const EAlreadyClaimed: u64 = 1010; 
    // 不在空投领取时间内
    const EClaimTimeInvalid: u64 = 1011; 
    // 无可领取的空投
    const ENoRemainingShares: u64 = 1012; 

    //管理员
    public struct AdminCap has key {
        id: UID,
    }

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
        //币种
        coin_type: address,
    }

    //空投

    public struct AirDrop_<phantom T>  has key,store {
        id:UID,
        // 空投起始时间（时间戳）
        start_time: u64,
        // 空投结束时间（时间戳）
        end_time: u64,
        // 总份数
        total_shares: u64,
        // 总金额
        total_amount: u64,
        //钱
        treasuryBal: Balance<T>,
        description: vector<u8>,
        // 是否开放
        is_open: bool,
        // 已领取份数
        claimed_shares: u64,
    }

    public struct Airdrops<phantom T> has key, store {
    id: UID,
    // 将 VecMap 改为 ObjectBag
    airdrops: ObjectBag,
}

    // 空投事件，用于记录空投信息
public struct AirDropEvent has copy, drop {
    round: u64,
    start_time: u64,
    end_time: u64,
    total_shares: u64,
    total_amount: u64,
    is_open: bool,
    description: vector<u8>,
    emitter: address,
    claimed_shares: u64,
}


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
        // 已领取空投数量
    claimed_airdrops: u64,
    }

    fun init(ctx: &mut TxContext) {
        let sender = tx_context::sender(ctx);
        let admin_cap = AdminCap {
            id: object::new(ctx),
        };
        transfer::transfer(admin_cap, sender);
    }

    /*
     * 创建配置对象
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
        coin_type: address,
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
            coin_type,
        };
        transfer::public_share_object(config);
    }


    entry fun new_airdrops<T>(
        _admin_cap: &AdminCap,
        ctx: &mut TxContext
    ) {
        let airdrops = Airdrops<T> {
            id: object::new(ctx),
            airdrops: object_bag::new(ctx),
        };
        transfer::public_share_object(airdrops);
    }

    /*
     * 邀请
     * @param config: 配置对象
     * @param inviter: 邀请人地址
     */
    entry fun invite(config: &mut Config, inviter: address, ctx: &TxContext) {
        let sender = tx_context::sender(ctx);
        // 根用户不能操作
        assert!(&sender == &config.root, ERoot);
        // 用户不能绑定自己
        assert!(&sender != &inviter, EInviteSelf);
        // 不能重复绑定
        assert!(vec_map::contains(&config.inviters, &sender), EInvited);
        vec_map::insert(&mut config.inviters, sender, inviter);
    }

    /*
    设置代币类型
    */
    entry fun setConfig(config: &mut Config, coin_type: address) {
        config.coin_type = coin_type;
    }
    /*
     * 获取邀请人
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
     * 增加节点
     * @param config: 配置对象
     * @param rank: 等级
     * @param name: 名称
     * @param description: 描述
     * @param limit: 每轮空投购买次数
     * @param price: 价格
     */
    entry fun insertNode(
        config: &mut Config,
        rank: u8,
        name: vector<u8>,
        description: vector<u8>,
        limit: u64,
        price: u64,
        quantity: u64,
        claimed_airdrops:u64
    ) {
        let node = Node {
            rank,
            name,
            description,
            limit,
            price,
            quantity,
            claimed_airdrops,
        };
        vec_map::insert(&mut config.nodes, rank, node);
    }

    /*
     * 移除节点
     * @param config: 配置对象
     * @param rank: 等级
     */
    entry fun removeNode(config: &mut Config, rank: u8) {
        vec_map::remove(&mut config.nodes, &rank);
    }

    /*
     * 修改节点
     * @param config: 配置对象
     * @param rank: 等级
     * @param name: 名称
     * @param description: 描述
     * @param limit: 每轮空投购买次数
     * @param price: 价格
     */
    entry fun modifyNode(
        config: &mut Config,
        rank: u8,
        name: vector<u8>,
        description: vector<u8>,
        limit: u64,
        price: u64,
        quantity: u64,
        claimed_airdrops:u64
    ) {
        let node = Node {
            rank,
            name,
            description,
            limit,
            price,
            quantity,
            claimed_airdrops,
        };
        vec_map::remove(&mut config.nodes, &rank);
        vec_map::insert(&mut config.nodes, rank, node);
    }

    /*
    购买节点
    */
    entry fun buyNode<T>(
        config: &mut Config,
        rank: u8,
        mut wallet: Coin<T>,
        ctx: &mut TxContext,
    ) {
        let sender = tx_context::sender(ctx);
        assert!(!vec_map::contains(&config.inviters, &sender), ENotInvited);
        // fix: 通过vec_map中是否包含这个元素，即可判断是否绑定
        assert!(vec_map::contains(&config.users, &sender) ,EAlreadyPurchased);

        // fix: 获取可变引用
        let nodeMut: &mut Node = vec_map::get_mut(&mut config.nodes, &rank);
        assert!(coin::value(&wallet) >= nodeMut.price, ETokenNotSet);
        assert!(nodeMut.quantity > 0, ENodeSoldOut);
        // 更新配置中的节点信息
        nodeMut.quantity = nodeMut.quantity - 1;

        let base: u64 = 10000;
        //购买成功，更新用户等级
        let inviter_address: &address = vec_map::get(&config.inviters, &sender);
        let inviter_rebate_value: u64 = nodeMut.price * base / config.inviter_fee;
        let inviter_share = coin::split<T>(&mut wallet, inviter_rebate_value, ctx);
        transfer::public_transfer(inviter_share, *inviter_address);
        let receiver_share = wallet;  // 剩余代币作为接收者的份额
        transfer::public_transfer(receiver_share, config.receiver);
        let user_rank: &u8 = vec_map::get(&config.users, &sender);
        assert!(*user_rank == 0, EInvited); // 假设用户未绑定时，rank为0，表示尚未绑定
        vec_map::insert(&mut config.users, sender, rank); // 更新用户等级
    }
     /*
     * 添加空投
     * @param airdrops: 空投集合对象
     * @param airdrop_id: 空投ID
     * @param start_time: 空投起始时间
     * @param end_time: 空投结束时间
     * @param total_shares: 空投总份数
     * @param total_amount: 空投总金额
     * @param description: 空投描述
     */
    entry fun add_airdrop<T>(
        airdrops: &mut Airdrops<T>,
        _admin_cap: &AdminCap,
        round: u64,
        start_time: u64,
        end_time: u64,
        total_shares: u64,
        total_amount: u64,
        description: vector<u8>,
        claimed_shares:u64,
        mut wallet: Coin<T>,
        ctx: &mut TxContext,
    ) {
       
        assert!(coin::value(&wallet) >= total_amount, ETokenNotSet);
        assert!(object_bag::contains(&airdrops.airdrops, round), EInvalidAirDrop);
        // 处理多余的入金
        let sender = tx_context::sender(ctx);
        let excess_amount = coin::value(&wallet) - total_amount;
        if (excess_amount > 0) {
            let excess_coin = coin::split(&mut wallet, excess_amount, ctx);
            transfer::public_transfer(excess_coin, sender);
        };
        let airdrop = AirDrop_<T> {
            id: object::new(ctx),
            start_time,
            end_time,
            total_shares,
            total_amount,
            treasuryBal: coin::into_balance(wallet),
            description,
            is_open:true,
            claimed_shares,
            
    };
        object_bag::add(&mut airdrops.airdrops, round, airdrop);
    }
    /*
     * 修改空投
     * @param airdrops: 空投集合对象
     * @param airdrop_id: 空投ID
     * @param new_start_time: 新的空投起始时间
     * @param new_end_time: 新的空投结束时间
     * @param new_total_shares: 新的空投总份数
     * @param new_total_amount: 新的空投总金额
     * @param new_description: 新的空投描述
     */
    entry fun modify_airdrop<T>(
        _admin_cap: &AdminCap,
        airdrops: &mut Airdrops<T>,
        round: u64,
        new_start_time: u64,
        new_end_time: u64,
        description: vector<u8>,
        is_open: bool,
    ) {
        assert!(!object_bag::contains(&airdrops.airdrops, round), EInvalidAirDrop);
        let airdrop: &mut AirDrop_<T> = object_bag::borrow_mut(&mut airdrops.airdrops, round);
        airdrop.start_time = new_start_time;
        airdrop.end_time = new_end_time;
        airdrop.description = description;
        airdrop.is_open = is_open;
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
        assert!(!object_bag::contains(&airdrops.airdrops, round), EInvalidAirDrop);
        let airdrop: &mut AirDrop_<T> = object_bag::borrow_mut(&mut airdrops.airdrops, round);
        let sender = tx_context::sender(ctx);
        let treasury_balance = balance::withdraw_all(&mut airdrop.treasuryBal);
        let treasury_coin = coin::from_balance(treasury_balance, ctx);
        transfer::public_transfer(treasury_coin, sender);
    }

    /*
 * 遍历所有空投并触发事件
 * @param airdrops: 空投集合对象
 * @param ctx: TxContext
 */
// 遍历所有空投并发出事件
// public fun emit_all_airdrop_events<T: key + store>(
//     airdrops: &Airdrops<T>,
//     ctx: &mut TxContext,
// ) {
//     // 获取所有空投的轮次
//     let keys: Option<ID> = object_bag::value_id(&airdrops.airdrops);
//     let len = vector::length(&keys);

//     let mut i = 0;
//     while (i < len) {
//         let round = *vector::borrow(&keys, i);
//         let airdrop: &AirDrop_<T> = object_bag::borrow(&airdrops.airdrops, &round);

//         // 触发空投事件，将空投信息发布
//         event::emit(AirDropEvent {
//             round: copy round,
//             start_time: airdrop.start_time,
//             end_time: airdrop.end_time,
//             total_shares: airdrop.total_shares,
//             total_amount: airdrop.total_amount,
//             is_open: airdrop.is_open,
//             description: airdrop.description,
//             emitter: ctx.sender(),
//             claimed_shares: airdrop.claimed_shares,
//         });

//         i = i + 1;
//     }
// }
//领取空投
entry fun claim_airdrop<T>(
        config: &mut Config,
        airdrops: &mut Airdrops<T>,
        round: u64,
        clock: &Clock,
        ctx: &mut TxContext,
        
    ) {
        let sender = tx_context::sender(ctx);
        assert!(object_bag::contains(&airdrops.airdrops, round), EInvalidAirDrop);
        let airdrop: &mut AirDrop_<T> = object_bag::borrow_mut(&mut airdrops.airdrops, round);
        
        // 检查是否在空投时间范围内
        let current_time = clock::timestamp_ms(clock);
        assert!(current_time >= airdrop.start_time && current_time <= airdrop.end_time, EClaimTimeInvalid);
        assert!(airdrop.total_shares > 0, ENoRemainingShares);
        //获取已领取次数
        let user_rank: &u8 = vec_map::get(&config.users, &sender);
        let nodeMut: &mut Node = vec_map::get_mut(&mut config.nodes, user_rank);
        assert!(nodeMut.claimed_airdrops < nodeMut.limit, EAlreadyClaimed);
        let per_share_amount = airdrop.total_amount / airdrop.total_shares;    
        airdrop.claimed_shares =airdrop.claimed_shares + 1;
        let treasury_balance = balance::split<T>(&mut airdrop.treasuryBal,per_share_amount);
        let treasury_coin = coin::from_balance(treasury_balance, ctx);
        transfer::public_transfer(treasury_coin, sender);
        }


}