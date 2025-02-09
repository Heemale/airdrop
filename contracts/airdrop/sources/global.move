module airdrop::global {

    // === Error ===

    const EPaused: u64 = 0;

    // === Struct ===

    public struct GLOBAL has drop {}

    // 全局对象
    public struct Global has key, store {
        id: UID,
        // 是否暂停
        is_pause: bool,
    }

    fun init(_witness: GLOBAL, ctx: &mut TxContext) {
        let global = Global {
            id: object::new(ctx),
            is_pause: true,
        };
        transfer::public_share_object(global);
    }

    public(package) fun pause(self: &mut Global) {
        self.is_pause = true;
    }

    public(package) fun un_pause(self: &mut Global) {
        self.is_pause = false;
    }

    public fun is_pause(self: &Global): bool {
        self.is_pause
    }

    // === Assertions ===

    public fun assert_pause(self: &Global) {
        assert!(!self.is_pause, EPaused);
    }
}
