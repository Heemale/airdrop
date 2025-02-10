module airdrop::invite {
    // === Imports ===

    use airdrop::global::{Global};
    use sui::vec_map::{Self, VecMap};
    use sui::address::{Self};
    use sui::event::{Self};

    // === Errors ===

    // 异常: 非法调用人
    const EInvalidSender: u64 = 1;
    // 异常: 非法邀请人
    const EInvalidInviter: u64 = 2;
    // 异常: 已绑定邀请人
    const EAlreadyBindInviter: u64 = 3;
    // 异常: 未绑定邀请人
    const ENotBindInviter: u64 = 4;
    // 异常：方法已弃用
    const EMethodDeprecated: u64 = 5;

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

    // === Event ===

    public struct Bind has copy, drop {
        // 用户
        sender: address,
        // 邀请人
        inviter: address,
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

    entry fun bind(
        _invite: &mut Invite,
        _inviter: address,
        _ctx: &TxContext
    ) {
        assert!(false, EMethodDeprecated);
    }

    /*
     * @notice 绑定邀请关系
     *
     * @param invite: invite对象
     * @param inviter: 邀请人地址
     */
    entry fun bind_v2(
        invite: &mut Invite,
        inviter: address,
        global: &Global,
        ctx: &TxContext
    ) {
        global.assert_pause();
        global.assert_object_invalid(invite.uid());

        let sender = tx_context::sender(ctx);
        // 断言：必须是合法调用人
        assert_invalid_sender(invite, sender);
        // 断言：必须是合法邀请人
        assert_invalid_inviter(invite, inviter);
        // 断言：需要未绑定邀请关系
        assert_already_bind_inviter(invite, sender);

        invite.inviters.insert(sender, inviter);

        event::emit(Bind {
            sender,
            inviter,
        })
    }

    /*
     * @notice 邀请人
     *
     * @param invite: invite对象
     * @param user: 用户地址
     * @return 邀请人地址
     */
    public fun inviters(invite: &Invite, user: address): address {
        if (invite.inviters.contains(&user)) {
            let iniviter: &address = invite.inviters.get(&user);
            *iniviter
        } else {
            address::from_u256(0)
        }
    }

    public fun root(invite: &Invite): address {
        invite.root
    }

    public fun inviter_fee(invite: &Invite): u64 {
        invite.inviter_fee
    }

    public fun uid(self: &Invite) :&UID {
        &self.id
    }

    // === Assertions ===

    public fun assert_invalid_sender(invite: &Invite, sender: address) {
        // 断言：调用人不能是root用户
        assert!(!(&sender == &invite.root), EInvalidSender);
    }

    public fun assert_invalid_inviter(invite: &Invite, inviter: address) {
        // 断言：邀请人必须是root用户或者已绑定的用户
        assert!(&inviter == &invite.root || invite.inviters.contains(&inviter), EInvalidInviter);
    }

    public fun assert_already_bind_inviter(invite: &Invite, sender: address) {
        // 断言：需要未绑定邀请关系
        assert!(!invite.inviters.contains(&sender), EAlreadyBindInviter);
    }

    public fun assert_not_bind_inviter(invite: &Invite, sender: address) {
        // 断言：需要已绑定邀请关系
        assert!(invite.inviters.contains(&sender), ENotBindInviter);
    }
}