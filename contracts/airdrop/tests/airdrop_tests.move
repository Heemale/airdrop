#[test_only]
module airdrop::airdrop_tests {
    use sui::test_scenario::{Self, ctx};
    use sui::sui::{SUI};
    use sui::coin::{Self, Coin};
    use airdrop::airdrop::{Self, AdminCap, Airdrops};
    use airdrop::node::{Self, Nodes};
    use airdrop::invite::{Self, Invite};
    use sui::clock::{Self};


    const Admin: address = @0x1;
    const Receiver: address = @0x2;
    const User: address = @0x3;


    #[test]
    fun test_invite() {
        let mut scenario = test_scenario::begin(Admin);

        // 初始化空投合约
        airdrop::init_for_test(ctx(&mut scenario));
        test_scenario::next_tx(&mut scenario, Admin);

        // 获取adminCap对象
        let adminCap = test_scenario::take_from_address<AdminCap>(&scenario, Admin);
        test_scenario::next_tx(&mut scenario, Admin);

        //实例化airdrop对象
        airdrop::new(
            &adminCap,
            ctx(&mut scenario)
        );
        test_scenario::next_tx(&mut scenario, Admin);

        // 获取airdrop对象
        let mut airdrops = test_scenario::take_shared<Airdrops>(&scenario);

        // 实例化nodes对象
        airdrop::new_node<SUI>(
            &adminCap,
            Receiver,
            ctx(&mut scenario)
        );
        test_scenario::next_tx(&mut scenario, Admin);

        // 获取nodes对象
        let mut nodes = test_scenario::take_shared<Nodes>(&scenario);
        assert!(node::receiver(&nodes) == Receiver, 1001);

        // 添加节点信息
        node::insert(
            &mut nodes,
            b"Node 1", // 节点名称
            b"Description of Node 1", // 节点描述
            3, // 每轮空投购买次数
            1000, // 价格
            10, // 总数量
        );
        test_scenario::next_tx(&mut scenario, Admin);

        airdrop::new_invite(
            &adminCap,
            Admin,
            200, // 邀请费用
            ctx(&mut scenario)
        );
        test_scenario::next_tx(&mut scenario, User);

        let mut invite = test_scenario::take_shared<Invite>(&scenario); // 获取 Invite 对象

        // 绑定邀请关系
        invite::bind(&mut invite, Admin, ctx(&mut scenario));
        test_scenario::next_tx(&mut scenario, User);

        // 读取邀请关系
        let inviter = invite::inviters(&invite, User);
        assert!(inviter == Admin, 1004);

        // 模拟用户购买节点
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
        // 验证购买的节点等级
        assert!(node::nodes_rank(&nodes, User) == 1, 1002);

        // 检查接收人接收到的资金
        let receiver_coin: Coin<SUI> = test_scenario::take_from_address<Coin<SUI>>(
            &scenario,
            node::receiver(&nodes)
        );
        assert!(coin::value(&receiver_coin) == 980, 1004);
        transfer::public_transfer(receiver_coin, node::receiver(&nodes));
        test_scenario::next_tx(&mut scenario, Admin);

        // 检查邀请人接收到的资金
        let inviter = invite::inviters(&invite, User);
        let inviter_coin: Coin<SUI> = test_scenario::take_from_address<Coin<SUI>>(
            &scenario,
            inviter
        );
        assert!(coin::value(&inviter_coin) == 20, 1004);
        transfer::public_transfer(inviter_coin, inviter);

        let wallet11 = coin::mint_for_testing<SUI>(1_000_000_000, ctx(&mut scenario));

        test_scenario::next_tx(&mut scenario, Admin);

        //添加空投信息
        airdrop::insert<SUI>(
            &adminCap,
            &mut airdrops,
            1000,
            2000,
            1,
            100000,
            b"Test Airdrop",
            wallet11,
            ctx(&mut scenario),
        );
        test_scenario::next_tx(&mut scenario, Admin);

        // === 模拟用户领取空投 ===
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

        clock::destroy_for_testing(clock);
        test_scenario::next_tx(&mut scenario, User);

        // === 模拟管理员结束空投 ===
        test_scenario::next_tx(&mut scenario, Admin);
        transfer::public_transfer(adminCap, Admin);
        test_scenario::return_shared(nodes);
        test_scenario::return_shared(invite);
        test_scenario::return_shared(airdrops);
        test_scenario::end(scenario);
    }
}

