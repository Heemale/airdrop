module airdrop::invite {
    // === Imports ===

    use sui::vec_map::{Self, VecMap};
    use sui::address::{Self};

    // === Errors ===

    // 异常: 非法调用人
    const EInvalidSender: u64 = 1;
    // 异常: 非法邀请人
    const EInvalidInviter: u64 = 2;
    // 异常: 已绑定邀请人
    const EAlreadyBindInviter: u64 = 3;
    // 异常: 未绑定邀请人
    const ENotBindInviter: u64 = 4;

    // === Struct ===

    // 邀请关系对象
    public struct Invite has key, store {
        id: UID,
        // 邀请关系: 用户地址 => 邀请人地址
        inviters: VecMap<address, address>,
        // 根用户
        root: address,
        // 邀请人费用, eg: 500 => 5%
        inviter_fee: u64,
    }

    /*
     * @notice 创建邀请关系对象
     *
     * @param root: root用户
     * @param inviter_fee: 邀请人费用
     */
    public(package) fun new(
        root: address,
        inviter_fee: u64,
        ctx: &mut TxContext
    ) {
        let invite = Invite {
            id: object::new(ctx),
            inviters: vec_map::empty(),
            root,
            inviter_fee
        };
        transfer::public_share_object(invite);
    }

    /*
     * @notice 修改邀请关系对象
     *
     * @param invite: 邀请关系对象
     * @param root: root用户
     * @param inviter_fee: 邀请人费用
     */
    public(package) fun modify(
        invite: &mut Invite,
        root: address,
        inviter_fee: u64,
    ) {
        invite.root = root;
        invite.inviter_fee = inviter_fee;
    }

    /*
     * @notice 绑定邀请关系
     *
     * @param invite: invite对象
     * @param inviter: 邀请人地址
     *
     * aborts-if:
     * - 调用人是根用户
     * - 邀请人是调用人或者邀请人自身没有进行绑定
     * - 重复绑定
     */
    entry fun bind(invite: &mut Invite, inviter: address, ctx: &TxContext) {
        let sender = tx_context::sender(ctx);
        assert_invalid_sender(invite, sender);
        assert_invalid_inviter(invite, inviter);
        assert_already_bind_inviter(invite, sender);
        vec_map::insert(&mut invite.inviters, sender, inviter);
    }

    /*
     * @notice 绑定邀请关系
     *
     * @param invite: invite对象
     * @param user: 用户地址
     * @return 邀请人地址
     */
    public fun inviters(invite: &Invite, user: address): address {
        if (vec_map::contains(&invite.inviters, &user)) {
            let iniviter: &address = vec_map::get(&invite.inviters, &user);
            *iniviter
        } else {
            address::from_u256(0)
        }
    }

    public fun root(config: &Invite): address {
        config.root
    }

    public fun inviter_fee(config: &Invite): u64 {
        config.inviter_fee
    }

    // === Assertions ===

    public fun assert_invalid_sender(invite: &Invite, sender: address) {
        assert!(!(&sender == &invite.root), EInvalidSender);
    }

    public fun assert_invalid_inviter(invite: &Invite, inviter: address) {
        // 邀请人必须是根用户或者已绑定的用户
        assert!(&inviter == &invite.root || vec_map::contains(&invite.inviters, &inviter), EInvalidInviter);
    }

    public fun assert_already_bind_inviter(invite: &Invite, sender: address) {
        assert!(!vec_map::contains(&invite.inviters, &sender), EAlreadyBindInviter);
    }

    public fun assert_not_bind_inviter(invite: &Invite, sender: address) {
        assert!(vec_map::contains(&invite.inviters, &sender), ENotBindInviter);
    }
}