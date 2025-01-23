module airdrop::global {

    use std::type_name::{TypeName};
    use sui::vec_map::{Self, VecMap};

    // === Error ===

    const EInitialized: u64 = 0;
    const EPaused: u64 = 1;
    const EBadWitness: u64 = 2;

    // === Struct ===

    public struct GLOBAL has drop {}

    // 全局对象
    public struct Global has key, store {
        id: UID,
        // 是否暂停
        is_pause: bool,
        // 初始化列表
        initialization_list: VecMap<TypeName, bool>,
    }

    fun init(_witness: GLOBAL, ctx: &mut TxContext) {
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

    public(package) fun update_initialization_list(self: &mut Global, object_type: TypeName, status: bool) {
        let is_exists = self.initialization_list.contains(&object_type);
        if (is_exists) {
            self.initialization_list.remove(&object_type);
            self.initialization_list.insert(object_type, status);
        } else {
            self.initialization_list.insert(object_type, status);
        }
    }

    public fun is_pause(self: &Global): bool {
        self.is_pause
    }

    public fun is_initialized(self: &Global, object_type: TypeName): bool {
        let is_exists = self.initialization_list.contains(&object_type);
        if (is_exists) {
            *self.initialization_list.get(&object_type)
        } else {
            false
        }
    }

    // === Assertions ===

    public fun assert_pause(self: &Global) {
        assert!(!self.is_pause, EPaused);
    }

    public fun assert_initialized(self: &Global, object_type: TypeName) {
        assert!(self.is_initialized(object_type), EInitialized);
    }

    public fun assert_bad_witness<T: drop>(witness: T) {
        assert!(sui::types::is_one_time_witness(&witness), EBadWitness);
    }
}
