#[test_only]
module airdrop::airdrop_tests {
    use sui::test_scenario::{Self, ctx};
    use sui::sui::{SUI};
    use sui::coin::{Self, Coin};
    use airdrop::airdrop::{Self, AdminCap, Airdrops};
    use airdrop::node::{Self, Nodes};
    use airdrop::invite::{Self, Invite};
 

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

        // 实例化nodes对象
        airdrop::new_node(
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
            1, // 节点等级
            b"Node 1", // 节点名称
            b"Description of Node 1", // 节点描述
            5, // 每轮空投购买次数
            1000, // 价格
            10, // 总数量
        );
        test_scenario::next_tx(&mut scenario, Admin);
       
        airdrop::new_invite(
            &adminCap,
            Admin,
            20, // 邀请费用
            ctx(&mut scenario)
        );
        test_scenario::next_tx(&mut scenario, User);
        let mut invite = test_scenario::take_shared<Invite>(&scenario); // 获取 Invite 对象
        // 绑定邀请关系
        invite::bind(&mut invite, Admin, ctx(&mut scenario));
        test_scenario::next_tx(&mut scenario, User);
    
        // 读取邀请关系
        let inviter = invite::inviters(&invite,User);
        assert!(inviter == Admin, 1004);
        // 模拟用户购买节点
        let  wallet = coin::mint_for_testing<SUI>(1_000_000_000, ctx(&mut scenario));
        test_scenario::next_tx(&mut scenario, User);
        node::buy(
            &mut nodes,
            &invite,
            1, // 节点等级
            wallet,
            ctx(&mut scenario)
        );
        test_scenario::next_tx(&mut scenario, User);
         // 验证购买的节点等级
        assert!( node::nodesRank(&nodes,User) == 1, 1002); 
        
        let sui_coin: Coin<0x2::sui::SUI> = test_scenario::take_from_address<Coin<0x2::sui::SUI>>(&scenario, node::receiver(&nodes));
        assert!(coin::value(&sui_coin) == 950, 1004); // 检查接收人接收到的资金
        transfer::public_transfer(sui_coin, node::receiver(&nodes));

        //  // 验证余额转移至接收人
        //  let receiver_balance = coin::split(&mut wallet,1000,ctx(&mut scenario));
        
        transfer::public_transfer(adminCap, Admin);
        test_scenario::return_shared(nodes);
        test_scenario::return_shared(invite);
        // test_scenario::return_shared(airdrops);
        test_scenario::end(scenario);
         // // 实例化airdrops对象
        // airdrop::new_airdrops<SUI>(&adminCap, ctx(&mut scenario));
        // test_scenario::next_tx(&mut scenario, Admin);
        //
        // // 获取airdrops对象
        // let airdrops = test_scenario::take_shared<Airdrops<SUI>>(&scenario);
        // test_scenario::next_tx(&mut scenario, User);
    }
}

