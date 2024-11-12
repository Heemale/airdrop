module airdrop::airdrop {
    // === Imports ===

    use sui::object_bag::{Self, ObjectBag};
    use sui::coin::{Self, Coin};
    use sui::balance::{Self, Balance};
    use sui::event::{Self};

    // === Errors ===

    // 异常: 余额不足
    const ECoinBalanceNotEnough: u64 = 9;
    // 异常: 轮次不存在
    const ERoundNotFound: u64 = 10;
    // 异常: 轮次已存在
    const ERoundExited: u64 = 11;

    // === Struct ===

    // 空投列表对象
    public struct Airdrops<phantom T> has key, store {
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
    }

    // 管理员权限对象
    public struct AdminCap has key, store {
        id: UID,
    }

    public struct AirdropInfo has copy, drop {
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
        airdrops: &mut Airdrops<T>,
        round: u64,
        start_time: u64,
        end_time: u64,
        is_open: bool,
    ) {
        assert_round_not_found(airdrops, round);
        let aidrop: &mut Airdrop<T> = object_bag::borrow_mut(&mut airdrops.airdrops, round);
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
        assert_round_not_found(airdrops, round);
        let aidrop: &mut Airdrop<T> = object_bag::borrow_mut(&mut airdrops.airdrops, round);
        let sender = tx_context::sender(ctx);
        let treasury_balance = balance::withdraw_all(&mut aidrop.treasury_balance);
        let treasury_coin = coin::from_balance(treasury_balance, ctx);
        transfer::public_transfer(treasury_coin, sender);
    }

    public fun airdrops() {
        event::emit(AirdropInfo {
            start_time: 0,
            end_time: 1,
            total_shares: 10,
            remaining_shares: 10,
            total_balance: 10,
            is_open: true,
        })
    }

    // === Assertions ===

    public fun assert_round_exited<T>(airdrops: &Airdrops<T>, round: u64) {
        assert!(!object_bag::contains(&airdrops.airdrops, round), ERoundExited);
    }

    public fun assert_round_not_found<T>(airdrops: &Airdrops<T>, round: u64) {
        assert!(object_bag::contains(&airdrops.airdrops, round), ERoundNotFound);
    }

    // === Testing ===

    #[test_only]
    entry fun init_for_test(ctx: &mut TxContext) {
        init(ctx);
    }
}