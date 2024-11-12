#[test_only]
module airdrop::airdrop_tests {
    use sui::test_scenario::{Self, ctx};
    use sui::sui::{SUI};
    use airdrop::airdrop::{Self, Config, AdminCap, Airdrops};

    const Admin: address = @0x1;
    const Receiver: address = @0x2;
    const User: address = @0x3;
    // const User2: address = @0x4;

    #[test]
    fun test_invite() {
        let mut scenario = test_scenario::begin(Admin);

        // 初始化空投合约
        airdrop::init_for_test(ctx(&mut scenario));
        test_scenario::next_tx(&mut scenario, Admin);

        // 获取adminCap对象
        let adminCap = test_scenario::take_from_address<AdminCap>(&scenario, Admin);
        test_scenario::next_tx(&mut scenario, Admin);

        // 实例化config对象
        airdrop::new_config(&adminCap, Admin, 500, Receiver, ctx(&mut scenario));
        test_scenario::next_tx(&mut scenario, User);

        // 获取config对象
        let mut config = test_scenario::take_shared<Config>(&scenario);
        assert!(airdrop::root(&config) == Admin, 1001);
        assert!(airdrop::inviter_fee(&config) == 500, 1002);
        assert!(airdrop::receiver(&config) == Receiver, 1003);

        // 实例化airdrops对象
        airdrop::new_airdrops<SUI>(&adminCap, ctx(&mut scenario));
        test_scenario::next_tx(&mut scenario, Admin);

        // 获取airdrops对象
        let airdrops = test_scenario::take_shared<Airdrops<SUI>>(&scenario);
        test_scenario::next_tx(&mut scenario, User);

        // 绑定邀请关系
        airdrop::invite(&mut config, Admin, ctx(&mut scenario));
        test_scenario::next_tx(&mut scenario, User);

        // 读取邀请关系
        let inviter = airdrop::get_inviter(&config, User);
        assert!(inviter == Admin, 1004);

        transfer::public_transfer(adminCap, Admin);
        test_scenario::return_shared(config);
        test_scenario::return_shared(airdrops);
        test_scenario::end(scenario);
    }
}

