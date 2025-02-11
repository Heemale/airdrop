#[test_only]
module airdrop::airdrop_tests {
    use airdrop::limit::{Self, Limits};
    use airdrop::invest::{Self, Invest};
    use airdrop::global::{Self, Global};
    use sui::test_scenario::{Self, Scenario, ctx};
    use sui::sui::{SUI};
    use sui::coin::{Self};
    use airdrop::airdrop::{Self, AdminCap, Airdrops};
    use airdrop::node::{Self, Nodes};
    use airdrop::invite::{Self, Invite};
    use sui::clock::{Self, Clock};
    use std::debug::print;
    use std::ascii::{string};

    const Admin: address = @0x1;
    const Receiver: address = @0x2;
    const User: address = @0x3;

    const EData: u64 = 0;

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
            1_000_000_000, // 价格
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
            let wallet = coin::mint_for_testing<SUI>(1_000_000_000, ctx(scenario));
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

    // === 添加空投 ===
    fun insert_airdrop(
        adminCap: &AdminCap,
        airdrops: &mut Airdrops,
        scenario: &mut Scenario
    ) {
        test_scenario::next_tx(scenario, Admin);
        let pay_coin = coin::mint_for_testing<SUI>(1000, ctx(scenario));
        airdrop::insert<SUI>(
            adminCap,
            airdrops,
            1000, // 开始时间
            2000, // 结束时间
            10, // 份数
            1000, // 总金额
            b"Airdros 1",
            pay_coin,
            b"",
            ctx(scenario),
        );
        let pay_coin = coin::mint_for_testing<SUI>(1000, ctx(scenario));
        airdrop::insert<SUI>(
            adminCap,
            airdrops,
            1000, // 开始时间
            2000, // 结束时间
            1, // 份数
            1000, // 总金额
            b"Airdrop 2",
            pay_coin,
            b"",
            ctx(scenario),
        );
    }

    // === 领取空投 ===
    fun claim_airdrop_v2(
        airdrops: &mut Airdrops,
        nodes: &mut Nodes,
        round: u64,
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
            round,
            clock,
            limits,
            invest,
            global,
            ctx(scenario),
        );
    }

    public fun print_user_node_status(status: u64) {
        if (status == 0) {
            print(&string(b"--- NODE_NOT_OWNED ---"));
        } else if (status == 1) {
            print(&string(b"--- NODE_ACTIVE ---"));
        } else {
            print(&string(b"--- NODE_DISABLED ---"));
        };
    }

    // 测试全局暂停
    #[test]
    #[expected_failure(abort_code = global::EPaused)]
    fun test_pause() {
        let mut scenario = test_scenario::begin(Admin);

        deploy(&mut scenario);

        test_scenario::next_tx(&mut scenario, Admin);
        let adminCap = test_scenario::take_from_address<AdminCap>(&scenario, Admin);
        let global = test_scenario::take_shared<Global>(&scenario);
        let mut invest = test_scenario::take_shared<Invest>(&scenario);
        let limits = test_scenario::take_shared<Limits>(&scenario);

        init_objects(&adminCap, &mut scenario);

        test_scenario::next_tx(&mut scenario, Admin);
        let mut clock = clock::create_for_testing(ctx(&mut scenario));
        let mut airdrops = test_scenario::take_shared<Airdrops>(&scenario);
        let mut nodes = test_scenario::take_shared<Nodes>(&scenario);
        let mut invite = test_scenario::take_shared<Invite>(&scenario);

        insert_node(&adminCap, &mut nodes, &mut scenario);
        insert_airdrop(&adminCap, &mut airdrops, &mut scenario);

        bind_invite_v2(&mut invite, &global, &mut scenario);
        buy_node_v2(&mut nodes, &invite, &mut invest, &global, &mut scenario);

        test_scenario::next_tx(&mut scenario, Admin);
        clock::set_for_testing(&mut clock, 1500);

        let round: u64 = 1;
        claim_airdrop_v2(&mut airdrops, &mut nodes, round, &clock, &limits, &mut invest, &global, &mut scenario);

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

    // 测试解除全局暂停
    #[test]
    fun test_un_pause() {
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

        let round: u64 = 1;
        claim_airdrop_v2(&mut airdrops, &mut nodes, round, &clock, &limits, &mut invest, &global, &mut scenario);

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

    // 测试购买权益后投资信息变更情况
    #[test]
    fun test_buy_node_invest_info_change() {
        let mut scenario = test_scenario::begin(Admin);

        deploy(&mut scenario);

        test_scenario::next_tx(&mut scenario, Admin);
        let adminCap = test_scenario::take_from_address<AdminCap>(&scenario, Admin);
        let mut global = test_scenario::take_shared<Global>(&scenario);
        let mut invest = test_scenario::take_shared<Invest>(&scenario);
        let limits = test_scenario::take_shared<Limits>(&scenario);

        init_objects(&adminCap, &mut scenario);

        test_scenario::next_tx(&mut scenario, Admin);
        let airdrops = test_scenario::take_shared<Airdrops>(&scenario);
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
        bind_invite_v2(&mut invite, &global, &mut scenario);
        buy_node_v2(&mut nodes, &invite, &mut invest, &global, &mut scenario);

        let (
            total_investment,
            total_gains,
            last_investment,
            last_accumulated_gains
        ) = invest.invest_info(User);

        assert!(total_investment == 1_000_000_000, EData);
        assert!(total_gains == 0, EData);
        assert!(last_investment == 1_000_000_000, EData);
        assert!(last_accumulated_gains == 0, EData);

        let (
            total_investment,
            total_gains,
            last_investment,
            last_accumulated_gains
        ) = invest.invest_info(Admin);

        assert!(total_investment == 0, EData);
        assert!(total_gains == 20_000_000, EData);
        assert!(last_investment == 0, EData);
        assert!(last_accumulated_gains == 20_000_000, EData);

        transfer::public_transfer(adminCap, Admin);
        test_scenario::return_shared(global);
        test_scenario::return_shared(invest);
        test_scenario::return_shared(limits);
        test_scenario::return_shared(nodes);
        test_scenario::return_shared(invite);
        test_scenario::return_shared(airdrops);
        test_scenario::end(scenario);
    }

    // 测试领取超过权益限制次数
    #[test]
    #[expected_failure(abort_code = node::EInsufficientRemainingQuantity)]
    fun test_claim_times_exceeds_node_limit() {
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

        let round: u64 = 1;
        claim_airdrop_v2(&mut airdrops, &mut nodes, round, &clock, &limits, &mut invest, &global, &mut scenario);
        claim_airdrop_v2(&mut airdrops, &mut nodes, round, &clock, &limits, &mut invest, &global, &mut scenario);
        claim_airdrop_v2(&mut airdrops, &mut nodes, round, &clock, &limits, &mut invest, &global, &mut scenario);

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

    // 测试领取超过空投限制次数
    #[test]
    #[expected_failure(abort_code = airdrop::ENoRemainingShares)]
    fun test_claim_times_exceeds_airdorp_limit() {
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

        let round: u64 = 2;
        claim_airdrop_v2(&mut airdrops, &mut nodes, round, &clock, &limits, &mut invest, &global, &mut scenario);
        claim_airdrop_v2(&mut airdrops, &mut nodes, round, &clock, &limits, &mut invest, &global, &mut scenario);
        claim_airdrop_v2(&mut airdrops, &mut nodes, round, &clock, &limits, &mut invest, &global, &mut scenario);

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

    // TODO 测试特殊限制

    // TODO 测试两倍收益禁用权益

    // TODO 测试两倍收益禁用权益后，再次购买激活
}
