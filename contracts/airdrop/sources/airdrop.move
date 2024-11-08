module airdrop::airdrop {
    use sui::vec_map::{Self, VecMap};
    use sui::address::{Self};

    // 异常: root用户
    const ERoot: u64 = 1001;
    // 异常: 绑定自己
    const EInviteSelf: u64 = 1002;
    // 异常: 已绑定
    const EInvited: u64 = 1003;

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
        root: address
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
    }

    fun init(ctx: &mut TxContext) {
        let sender = tx_context::sender(ctx);
        let config = Config {
            id: object::new(ctx),
            nodes: vec_map::empty(),
            inviters: vec_map::empty(),
            users: vec_map::empty(),
            root: sender,
        };
        transfer::public_share_object(config);
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
        assert!(&sender == &inviter, EInviteSelf);
        // 不能重复绑定
        assert!(vec_map::contains(&config.inviters, &sender), EInvited);
        vec_map::insert(&mut config.inviters, sender, inviter);
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
        price: u64
    ) {
        let node = Node {
            rank,
            name,
            description,
            limit,
            price,
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
        price: u64
    ) {
        let node = Node {
            rank,
            name,
            description,
            limit,
            price,
        };
        vec_map::remove(&mut config.nodes, &rank);
        vec_map::insert(&mut config.nodes, rank, node);
    }
}