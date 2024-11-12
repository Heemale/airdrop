module airdrop::airdrop {
    use sui::vec_map::{Self, VecMap};
    use sui::coin::{Self, Coin};
    use sui::address::{Self};
    use sui::balance::{Self, Balance};
    use sui::event;
    use sui::clock::{Self, Clock};
    use sui::object_bag::{Self, ObjectBag};
    use airdrop::node::{Self,Node};

    // 异常: 空投已结束
    const EInvalidAirDrop : u64 = 1009;
    /
    // 不在空投领取时间内
    const EClaimTimeInvalid: u64 = 1011; 
    // 无可领取的空投
    const ENoRemainingShares: u64 = 1012; 
    // 币种未设置
    const ETokenNotSet: u64 = 1013;
    //管理员
    public struct AdminCap has key {
        id: UID,
    }

    // 配置对象
    public struct Config has key, store {
        id: UID,
    
        // 用户信息: 用户地址 => 等级
        users: VecMap<address, u8>,
       
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
        receiver: address,
        coin_type: address,
        ctx: &mut TxContext
    ) {
        let config = Config {
            id: object::new(ctx),
            users: vec_map::empty(),
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
    设置代币类型
    */
    entry fun setConfig(config: &mut Config, coin_type: address) {
        config.coin_type = coin_type;
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
        node: &Node
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
        node::assert_node_sold_out(node);
        let per_share_amount = airdrop.total_amount / airdrop.total_shares;    
        airdrop.claimed_shares =airdrop.claimed_shares + 1;
        let treasury_balance = balance::split<T>(&mut airdrop.treasuryBal,per_share_amount);
        let treasury_coin = coin::from_balance(treasury_balance, ctx);
        transfer::public_transfer(treasury_coin, sender);
        }


}