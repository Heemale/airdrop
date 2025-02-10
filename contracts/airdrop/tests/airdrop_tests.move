#[test_only]
module airdrop::airdrop_tests {
    use airdrop::limit::Limits;
    use airdrop::invest::Invest;
    use airdrop::global::Global;
    use airdrop::limit;
    use airdrop::invest;
    use airdrop::global;
    use sui::test_scenario::{Self, Scenario, ctx};
    use sui::sui::{SUI};
    use sui::coin::{Self};
    use airdrop::airdrop::{Self, AdminCap, Airdrops};
    use airdrop::node::{Self, Nodes};
    use airdrop::invite::{Self, Invite};
    use sui::clock::{Self, Clock};
    use std::debug::{Self};

    const Admin: address = @0x1;
    const Receiver: address = @0x2;
    const User: address = @0x3;

    const E: u64 = 1;

    // === 部署空投合约 ===
    fun deploy(scenario: &mut Scenario) {
        test_scenario::next_tx(scenario, Admin);
        {
            airdrop::init_for_test(ctx(scenario));
            global::init_for_test(ctx(scenario));
            invest::init_for_test(ctx(scenario));
            limit::init_for_test(ctx(scenario));
        };
    }

    // === 实例化对象 ===
    fun init_objects(adminCap: &AdminCap, scenario: &mut Scenario) {
        test_scenario::next_tx(scenario, Admin);
        {
            airdrop::new(
                adminCap,
                ctx(scenario)
            );
            airdrop::new_node<SUI>(
                adminCap,
                Receiver,
                ctx(scenario)
            );
            airdrop::new_invite(
                adminCap,
                Admin,
                200,
                ctx(scenario)
            );
        };
    }

    // === 绑定邀请关系 ===
    fun bind_invite_v2(
        invite: &mut Invite,
        global: &Global,
        scenario: &mut Scenario
    ) {
        test_scenario::next_tx(scenario, User);
        invite::bind_v2(invite, Admin, global, ctx(scenario));
    }

    // entry fun check_bind_invite_v2(invite: &Invite) {
    //     let inviter = invite::inviters(invite, User);
    //     assert!(inviter == Admin, E);
    // }

    // === 添加节点 ===
    fun insert_node(
        adminCap: &AdminCap,
        nodes: &mut Nodes,
        scenario: &mut Scenario
    ) {
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
    fun buy_node_v2(
        nodes: &mut Nodes,
        invite: &Invite,
        invest: &mut Invest,
        global: &Global,
        scenario: &mut Scenario
    ) {
        test_scenario::next_tx(scenario, User);
        {
            let wallet = coin::mint_for_testing<SUI>(1000, ctx(scenario));
            node::buy_v2<SUI>(
                nodes,
                invite,
                1, // 节点等级
                wallet,
                invest,
                global,
                ctx(scenario)
            );
        };
    }

    // entry fun check_buy_node(
    //     nodes: &Nodes,
    //     invite: &Invite,
    //     scenario: &mut Scenario
    // ) {
    //     // === 检查购买节点的等级 ===
    //     assert!(node::nodes_rank(nodes, User) == 1, E);
    //
    //     // === 检查接收人接收到的资金 ===
    //     let receiver_coin: Coin<SUI> = test_scenario::take_from_address<Coin<SUI>>(
    //         scenario,
    //         node::receiver(nodes)
    //     );
    //     assert!(receiver_coin.value() == 980, E);
    //     transfer::public_transfer(receiver_coin, node::receiver(nodes));
    //
    //     // === 检查邀请人接收到的资金 ===
    //     let inviter = invite::inviters(invite, User);
    //     let inviter_coin: Coin<SUI> = test_scenario::take_from_address<Coin<SUI>>(
    //         scenario,
    //         inviter
    //     );
    //     assert!(inviter_coin.value() == 20, E);
    //     transfer::public_transfer(inviter_coin, inviter);
    //     test_scenario::next_tx(scenario, User);
    // }

    // === 添加空投 ===
    fun insert_airdrop(
        adminCap: &AdminCap,
        airdrops: &mut Airdrops,
        scenario: &mut Scenario
    ) {
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
    fun cliam_airdrop_v2(
        airdrops: &mut Airdrops,
        nodes: &mut Nodes,
        clock: &Clock,
        limits: &Limits,
        invest: &mut Invest,
        global: &Global,
        scenario: &mut Scenario
    ) {
        test_scenario::next_tx(scenario, User);
        airdrop::claim_v2<SUI>(
            airdrops,
            nodes,
            1, // round
            clock,
            limits,
            invest,
            global,
            ctx(scenario),
        );
    }

    #[test]
    fun test_cliam() {
        // === 开始测试 ===
        let mut scenario = test_scenario::begin(Admin);

        deploy(&mut scenario);

        test_scenario::next_tx(&mut scenario, Admin);
        let adminCap = test_scenario::take_from_address<AdminCap>(&scenario, Admin);
        let mut global = test_scenario::take_shared<Global>(&scenario);
        let mut invest = test_scenario::take_shared<Invest>(&scenario);
        let limits = test_scenario::take_shared<Limits>(&scenario);

        init_objects(&adminCap, &mut scenario);

        test_scenario::next_tx(&mut scenario, Admin);
        let mut clock = clock::create_for_testing(ctx(&mut scenario));

        test_scenario::next_tx(&mut scenario, Admin);
        let mut airdrops = test_scenario::take_shared<Airdrops>(&scenario);
        let mut nodes = test_scenario::take_shared<Nodes>(&scenario);
        let mut invite = test_scenario::take_shared<Invite>(&scenario);

        test_scenario::next_tx(&mut scenario, Admin);
        {
            global.un_pause();
            let id = *object::uid_as_inner(airdrops.uid());
            global.update_initialization_list(id, true);

            let id = *object::uid_as_inner(nodes.uid());
            global.update_initialization_list(id, true);

            let id = *object::uid_as_inner(invite.uid());
            global.update_initialization_list(id, true);
        };

        insert_node(&adminCap, &mut nodes, &mut scenario);
        insert_airdrop(&adminCap, &mut airdrops, &mut scenario);

        bind_invite_v2(&mut invite, &global, &mut scenario);
        buy_node_v2(&mut nodes, &invite, &mut invest, &global, &mut scenario);

        test_scenario::next_tx(&mut scenario, Admin);
        clock::set_for_testing(&mut clock, 1500);

        cliam_airdrop_v2(&mut airdrops, &mut nodes, &clock, &limits, &mut invest, &global, &mut scenario);
        let remaining_times = node::remaining_quantity_of_claim_v2(&nodes, User, 1, &limits);
        debug::print(&remaining_times);
        let claimed_times = nodes.claimed_times(1, 1);
        debug::print(&claimed_times);
        // assert!(remaining_times == 1, E);
        // assert!(claimed_times == 1, E);

        // test_scenario::next_tx(&mut scenario, Admin);
        // cliam_airdrop_v2(&mut airdrops, &mut nodes, &clock, &limits, &mut invest, &global, &mut scenario);
        // let remaining_times = node::remaining_quantity_of_claim_v2(&nodes, User, 1, &limits);
        // let claimed_times = nodes.claimed_times(1, 1);
        // assert!(remaining_times == 0, E);
        // assert!(claimed_times == 2, E);

        // test_scenario::next_tx(&mut scenario, Admin);
        // cliam_airdrop_v2(&mut airdrops, &mut nodes, &clock, &limits, &mut invest, &global, &mut scenario);
        // let claimed_times = nodes.claimed_times(1, 1);
        // // bug 1: 没有拦截，还能继续领取
        // assert!(claimed_times != 3, E);

        // === 结束测试 ===
        transfer::public_transfer(adminCap, Admin);
        clock::destroy_for_testing(clock);
        test_scenario::return_shared(global);
        test_scenario::return_shared(invest);
        test_scenario::return_shared(limits);
        test_scenario::return_shared(nodes);
        test_scenario::return_shared(invite);
        test_scenario::return_shared(airdrops);
        test_scenario::end(scenario);
    }
}
