#[test_only]
module airdrop::airdrop_tests {
    use sui::test_scenario::{Self, ctx};
    use sui::sui::{SUI};
    use sui::coin::{Self, Coin};
    use sui::clock::{Self};
    use airdrop::airdrop::{Self, AdminCap, Airdrops};
    use airdrop::node::{Self, Nodes};
    use airdrop::invite::{Self, Invite};
    use airdrop::limit::{Limits};

    const Admin: address = @0x1;
    const Receiver: address = @0x2;
    const User: address = @0x3;
    const User2: address = @0x4;

    const E: u64 = 1;

    #[test]
    fun test_invite() {
        // === 开始测试 ===
        let mut scenario = test_scenario::begin(Admin);
        // === 初始化空投合约 ===
        // === 获取adminCap对象 ===
        airdrop::init_for_test(ctx(&mut scenario));
        test_scenario::next_tx(&mut scenario, Admin);
        let adminCap = test_scenario::take_from_address<AdminCap>(&scenario, Admin);

        // === 实例化SpecialLimits对象 ===
        // === 获取SpecialLimits对象 ===
        test_scenario::next_tx(&mut scenario, Admin);
        airdrop::new_special_limits(
            &adminCap,
            ctx(&mut scenario)
        );
        test_scenario::next_tx(&mut scenario, Admin);
        let special_limits = test_scenario::take_shared<Limits>(&scenario);

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
        assert!(node::receiver(&nodes) == Receiver, E);

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
        assert!(inviter == Admin, E);

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
        assert!(node::nodes_rank(&nodes, User) == 1, E);
        // === 检查接收人接收到的资金 ===
        let receiver_coin: Coin<SUI> = test_scenario::take_from_address<Coin<SUI>>(
            &scenario,
            node::receiver(&nodes)
        );
        assert!(coin::value(&receiver_coin) == 980, E);
        transfer::public_transfer(receiver_coin, node::receiver(&nodes));

        // === 检查邀请人接收到的资金 ===
        test_scenario::next_tx(&mut scenario, Admin);
        let inviter = invite::inviters(&invite, User);
        let inviter_coin: Coin<SUI> = test_scenario::take_from_address<Coin<SUI>>(
            &scenario,
            inviter
        );
        assert!(coin::value(&inviter_coin) == 20, E);
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
        airdrop::claim_v2<SUI>(
            &mut airdrops,
            &mut nodes,
            1, // round
            &clock,
            &special_limits,
            ctx(&mut scenario),
        );
        test_scenario::next_tx(&mut scenario, User);
        let times = node::remaining_quantity_of_claim(&nodes, User, 1);
        assert!(times == 4, E);

        test_scenario::next_tx(&mut scenario, User);
        airdrop::claim_v2<SUI>(
            &mut airdrops,
            &mut nodes,
            1,
            &clock,
            &special_limits,
            ctx(&mut scenario),
        );
        test_scenario::next_tx(&mut scenario, User);
        let times = node::remaining_quantity_of_claim(&nodes, User, 1);
        assert!(times == 3, E);

        // === 检查节点转让 ===
        test_scenario::next_tx(&mut scenario, User);
        node::transfer(&mut nodes, User2, ctx(&mut scenario));
        // === 检查节点等级 ===
        assert!(node::nodes_rank(&nodes, User2) == 1, E);
        assert!(node::is_already_buy_node(&nodes, User) == false, E);
        assert!(node::remaining_quantity_of_claim(&nodes, User, 1) == 0, E);
        assert!(node::remaining_quantity_of_claim(&nodes, User2, 1) == 3, E);

        // === 结束测试 ===
        clock::destroy_for_testing(clock);
        transfer::public_transfer(adminCap, Admin);
        test_scenario::return_shared(special_limits);
        test_scenario::return_shared(nodes);
        test_scenario::return_shared(invite);
        test_scenario::return_shared(airdrops);
        test_scenario::end(scenario);
    }
}

