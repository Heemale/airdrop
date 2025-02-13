module airdrop::global {

    use sui::event;
    use sui::vec_map::{Self, VecMap};

    // === Error ===

    const EPaused: u64 = 0;
    const EInvalidObject: u64 = 1;

    // === Struct ===

    // 全局对象
    public struct Global has key, store {
        id: UID,
        // 是否暂停
        is_pause: bool,
        // 初始化列表
        // 注：Invite、Nodes和Airdrops对象没有使用otw，所以要手动记录合法的对象。
        initialization_list: VecMap<ID, bool>,
    }

    // === Event ===

    public struct UpdateInitializationList has copy, drop {
        // 对象Id
        object: ID,
        // 是否合法
        is_valid: bool,
    }

    public(package) fun new(ctx: &mut TxContext) {
        let global = Global {
            id: object::new(ctx),
            is_pause: true,
            initialization_list: vec_map::empty(),
        };
        transfer::public_share_object(global);
    }

    public(package) fun pause(self: &mut Global) {
        self.is_pause = true;
    }

    public(package) fun un_pause(self: &mut Global) {
        self.is_pause = false;
    }

    public(package) fun update_initialization_list(self: &mut Global, object: ID, is_valid: bool) {
        let is_exists = self.initialization_list.contains(&object);
        if (is_exists) {
            self.initialization_list.remove(&object);
        };
        self.initialization_list.insert(object, is_valid);

        event::emit(UpdateInitializationList {
            object,
            is_valid,
        });
    }

    public fun object_is_valid(self: &Global, object: &ID): bool {
        let is_exists = self.initialization_list.contains(object);
        if (is_exists) {
            *self.initialization_list.get(object)
        } else {
            false
        }
    }

    public fun is_pause(self: &Global): bool {
        self.is_pause
    }

    // === Assertions ===

    public fun assert_paused(self: &Global) {
        assert!(!self.is_pause, EPaused);
    }

    public fun assert_object_invalid(self: &Global, object: &UID) {
        let id: &ID = object::uid_as_inner(object);
        assert!(self.object_is_valid(id), EInvalidObject);
    }
}
