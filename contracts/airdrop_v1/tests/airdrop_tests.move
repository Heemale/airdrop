#[test_only]
module airdrop::airdrop_tests {
    use sui::test_scenario::{Self, Scenario, ctx};
    use sui::sui::{SUI};
    use sui::coin::{Self, Coin};
    use airdrop::airdrop::{Self, AdminCap, Airdrops};
    use airdrop::node::{Self, Nodes};
    use airdrop::invite::{Self, Invite};
    use sui::clock::{Self, Clock};

    const Admin: address = @0x1;
    const Receiver: address = @0x2;
    const User: address = @0x3;
    const User2: address = @0x4;

    const EData: u64 = 1;

    // === 部署空投合约 ===
    fun deploy(scenario: &mut Scenario) {
        airdrop::init_for_test(ctx(scenario));
        test_scenario::next_tx(scenario, Admin);
    }

    // === 实例化对象 ===
    fun init_objects(adminCap: &AdminCap, scenario: &mut Scenario) {
        test_scenario::next_tx(scenario, Admin);
        airdrop::new(
            adminCap,
            ctx(scenario)
        );
        test_scenario::next_tx(scenario, Admin);

        test_scenario::next_tx(scenario, Admin);
        airdrop::new_node<SUI>(
            adminCap,
            Receiver,
            ctx(scenario)
        );

        test_scenario::next_tx(scenario, Admin);
        airdrop::new_invite(
            adminCap,
            Admin,
            200,
            ctx(scenario)
        );
    }

    // === 绑定邀请关系 ===
    fun bind_invite(invite: &mut Invite, scenario: &mut Scenario) {
        test_scenario::next_tx(scenario, User);
        invite::bind(invite, Admin, ctx(scenario));
        // let inviter = invite::inviters(&invite, User);
        // assert!(inviter == Admin, E);
    }

    // === 添加节点 ===
    fun insert_node(adminCap: &AdminCap, nodes: &mut Nodes, scenario: &mut Scenario) {
        test_scenario::next_tx(scenario, Admin);
        airdrop::insert_node(
            adminCap,
            nodes,
            b"Node 1", // 节点名称
            b"Description of Node 1", // 节点描述
            2, // 每轮空投购买次数
            1000, // 价格
            10, // 总数量
        );
    }

    // === 购买节点 ===
    fun buy_node(nodes: &mut Nodes, invite: &Invite, scenario: &mut Scenario) {
        test_scenario::next_tx(scenario, User);
        {
            let wallet = coin::mint_for_testing<SUI>(1000, ctx(scenario));
            node::buy<SUI>(
                nodes,
                invite,
                1, // 节点等级
                wallet,
                ctx(scenario)
            );
        };

        // // === 检查购买节点的等级 ===
        // assert!(node::nodes_rank(&nodes, User) == 1, E);
        //
        // // === 检查接收人接收到的资金 ===
        // let receiver_coin: Coin<SUI> = test_scenario::take_from_address<Coin<SUI>>(
        //     &scenario,
        //     node::receiver(&nodes)
        // );
        // assert!(receiver_coin.value() == 980, E);
        // transfer::public_transfer(receiver_coin, node::receiver(&nodes));
        //
        // // === 检查邀请人接收到的资金 ===
        // let inviter = invite::inviters(&invite, User);
        // let inviter_coin: Coin<SUI> = test_scenario::take_from_address<Coin<SUI>>(
        //     &scenario,
        //     inviter
        // );
        // assert!(inviter_coin.value() == 20, E);
        // transfer::public_transfer(inviter_coin, inviter);
    }

    // === 添加空投 ===
    fun insert_airdrop(adminCap: &AdminCap, airdrops: &mut Airdrops, scenario: &mut Scenario) {
        test_scenario::next_tx(scenario, Admin);
        let pay_coin = coin::mint_for_testing<SUI>(1_000_000_000, ctx(scenario));
        airdrop::insert<SUI>(
            adminCap,
            airdrops,
            1000, // 开始时间
            2000, // 结束时间
            10,
            100000,
            b"Test Airdrop",
            pay_coin,
            b"http://localhost:3000/01.png",
            ctx(scenario),
        );
    }

    // === 领取空投 ===
    fun cliam_airdrop(airdrops: &mut Airdrops, nodes: &mut Nodes, clock: &Clock, scenario: &mut Scenario) {
        test_scenario::next_tx(scenario, User);
        airdrop::claim<SUI>(
            airdrops,
            nodes,
            1, // round
            clock,
            ctx(scenario),
        );
    }

    #[test]
    // 测试；流程
    fun test_process() {
        // === 开始测试 ===
        let mut scenario = test_scenario::begin(Admin);
        // === 初始化空投合约 ===
        // === 获取adminCap对象 ===
        airdrop::init_for_test(ctx(&mut scenario));
        test_scenario::next_tx(&mut scenario, Admin);
        let adminCap = test_scenario::take_from_address<AdminCap>(&scenario, Admin);

        // === 实例化airdrops对象 ===
        // === 获取airdrops对象 ===
        test_scenario::next_tx(&mut scenario, Admin);
        airdrop::new(
            &adminCap,
            ctx(&mut scenario)
        );
        test_scenario::next_tx(&mut scenario, Admin);
        let mut airdrops = test_scenario::take_shared<Airdrops>(&scenario);

        // === 实例化nodes对象 ===
        // === 获取nodes对象 ===
        test_scenario::next_tx(&mut scenario, Admin);
        airdrop::new_node<SUI>(
            &adminCap,
            Receiver,
            ctx(&mut scenario)
        );
        test_scenario::next_tx(&mut scenario, Admin);
        let mut nodes = test_scenario::take_shared<Nodes>(&scenario);
        assert!(node::receiver(&nodes) == Receiver, EData);

        // === 实例化invite对象 ===
        // === 获取invite对象 ===
        test_scenario::next_tx(&mut scenario, Admin);
        airdrop::new_invite(
            &adminCap,
            Admin,
            200,
            ctx(&mut scenario)
        );
        test_scenario::next_tx(&mut scenario, Admin);
        let mut invite = test_scenario::take_shared<Invite>(&scenario);

        // === 绑定邀请关系 ===
        // === 读取邀请关系 ===
        test_scenario::next_tx(&mut scenario, User);
        invite::bind(&mut invite, Admin, ctx(&mut scenario));
        let inviter = invite::inviters(&invite, User);
        assert!(inviter == Admin, EData);

        // === 添加节点 ===
        test_scenario::next_tx(&mut scenario, Admin);
        node::insert(
            &mut nodes,
            b"Node 1", // 节点名称
            b"Description of Node 1", // 节点描述
            5, // 每轮空投购买次数
            1000, // 价格
            10, // 总数量
        );

        // === 购买节点 ===
        // === 购买节点 ===
        test_scenario::next_tx(&mut scenario, User);
        let wallet = coin::mint_for_testing<SUI>(1_000_000_000, ctx(&mut scenario));
        test_scenario::next_tx(&mut scenario, User);
        node::buy<SUI>(
            &mut nodes,
            &invite,
            1, // 节点等级
            wallet,
            ctx(&mut scenario)
        );
        test_scenario::next_tx(&mut scenario, User);

        // === 验证购买的节点等级 ===
        assert!(node::nodes_rank(&nodes, User) == 1, EData);
        // === 检查接收人接收到的资金 ===
        let receiver_coin: Coin<SUI> = test_scenario::take_from_address<Coin<SUI>>(
            &scenario,
            node::receiver(&nodes)
        );
        assert!(coin::value(&receiver_coin) == 980, EData);
        transfer::public_transfer(receiver_coin, node::receiver(&nodes));

        // === 检查邀请人接收到的资金 ===
        test_scenario::next_tx(&mut scenario, Admin);
        let inviter = invite::inviters(&invite, User);
        let inviter_coin: Coin<SUI> = test_scenario::take_from_address<Coin<SUI>>(
            &scenario,
            inviter
        );
        assert!(coin::value(&inviter_coin) == 20, EData);
        transfer::public_transfer(inviter_coin, inviter);

        // === 添加空投信息 ===
        test_scenario::next_tx(&mut scenario, Admin);
        let wallet11 = coin::mint_for_testing<SUI>(1_000_000_000, ctx(&mut scenario));
        airdrop::insert<SUI>(
            &adminCap,
            &mut airdrops,
            1000,
            2000,
            10,
            100000,
            b"Test Airdrop",
            wallet11,
            b"http://localhost:3000/01.png",
            ctx(&mut scenario),
        );

        // === 领取空投 ===
        test_scenario::next_tx(&mut scenario, Admin);
        let mut clock = clock::create_for_testing(ctx(&mut scenario)); // 模拟当前时间在空投范围内
        clock::set_for_testing(&mut clock, 1500);

        test_scenario::next_tx(&mut scenario, User);
        airdrop::claim<SUI>(
            &mut airdrops,
            &mut nodes,
            1, // round
            &clock,
            ctx(&mut scenario),
        );
        test_scenario::next_tx(&mut scenario, User);
        let times = node::remaining_quantity_of_claim(&nodes, User, 1);
        assert!(times == 4, EData);

        test_scenario::next_tx(&mut scenario, User);
        airdrop::claim<SUI>(
            &mut airdrops,
            &mut nodes,
            1,
            &clock,
            ctx(&mut scenario),
        );
        test_scenario::next_tx(&mut scenario, User);
        let times = node::remaining_quantity_of_claim(&nodes, User, 1);
        assert!(times == 3, EData);

        // === 检查节点转让 ===
        test_scenario::next_tx(&mut scenario, User);
        node::transfer(&mut nodes, User2, ctx(&mut scenario));
        // === 检查节点等级 ===
        assert!(node::nodes_rank(&nodes, User2) == 1, EData);
        assert!(node::is_already_buy_node(&nodes, User) == false, EData);
        assert!(node::remaining_quantity_of_claim(&nodes, User, 1) == 0, EData);
        assert!(node::remaining_quantity_of_claim(&nodes, User2, 1) == 3, EData);

        // === 结束测试 ===
        transfer::public_transfer(adminCap, Admin);
        clock::destroy_for_testing(clock);
        test_scenario::return_shared(nodes);
        test_scenario::return_shared(invite);
        test_scenario::return_shared(airdrops);
        test_scenario::end(scenario);
    }

    // 测试领取超过权益限制次数
    #[test]
    #[expected_failure(abort_code = EData)]
    fun test_claim_times_exceeds_node_limit() {
        // === 开始测试 ===
        let mut scenario = test_scenario::begin(Admin);

        deploy(&mut scenario);
        let adminCap = test_scenario::take_from_address<AdminCap>(&scenario, Admin);

        init_objects(&adminCap, &mut scenario);

        test_scenario::next_tx(&mut scenario, Admin);
        let mut clock = clock::create_for_testing(ctx(&mut scenario));
        let mut airdrops = test_scenario::take_shared<Airdrops>(&scenario);
        let mut nodes = test_scenario::take_shared<Nodes>(&scenario);
        let mut invite = test_scenario::take_shared<Invite>(&scenario);

        bind_invite(&mut invite, &mut scenario);
        insert_node(&adminCap, &mut nodes, &mut scenario);
        buy_node(&mut nodes, &invite, &mut scenario);
        insert_airdrop(&adminCap, &mut airdrops, &mut scenario);

        test_scenario::next_tx(&mut scenario, Admin);
        clock::set_for_testing(&mut clock, 1500);

        test_scenario::next_tx(&mut scenario, Admin);
        cliam_airdrop(&mut airdrops, &mut nodes, &clock, &mut scenario);
        let remaining_times = node::remaining_quantity_of_claim(&nodes, User, 1);
        assert!(remaining_times == 1, EData);
        let claim_times = node::claim_times(&nodes, 1, 1);
        assert!(claim_times == 1, EData);

        test_scenario::next_tx(&mut scenario, Admin);
        cliam_airdrop(&mut airdrops, &mut nodes, &clock, &mut scenario);
        let remaining_times = node::remaining_quantity_of_claim(&nodes, User, 1);
        assert!(remaining_times == 0, EData);
        let claim_times = node::claim_times(&nodes, 1, 1);
        assert!(claim_times == 2, EData);

        test_scenario::next_tx(&mut scenario, Admin);
        cliam_airdrop(&mut airdrops, &mut nodes, &clock, &mut scenario);
        let claim_times = node::claim_times(&nodes, 1, 1);
        // 🐞 bug 1: 没有拦截，还能继续领取
        assert!(claim_times != 3, EData);

        // === 结束测试 ===
        transfer::public_transfer(adminCap, Admin);
        clock::destroy_for_testing(clock);
        test_scenario::return_shared(nodes);
        test_scenario::return_shared(invite);
        test_scenario::return_shared(airdrops);
        test_scenario::end(scenario);
    }
}

