import * as React from 'react';
import { useEffect, useState } from 'react';
import NavBarWrapper from '@/components/NavBarWrapper';
import { useCurrentAccount } from '@mysten/dapp-kit';
import Share from '@/components/Personalcenter/share';
import Recommender from '@/components/Personalcenter/recommender';
import BindAddressList from '@/components/Personalcenter/bindAddressList';
import { getUserInfo } from '@/api';
import { useClientTranslation } from '@/hook';

interface Props {
  params: Promise<{ locale: string }>;
}

interface UserInfo {
  shares: number;
  teams: number;
}

const Home = async (props: Props) => {
  const account = useCurrentAccount();
  const { t } = useClientTranslation();

  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 获取用户信息
  useEffect(() => {
    const fetchUserInfo = async () => {
      if (account) {
        try {
          setLoading(true);
          const response = await getUserInfo(); // 调用API获取用户信息
          setUserInfo(response.data);
        } catch (err) {
          setError('Failed to fetch user info');
          console.error(err);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUserInfo();
  }, [account]);

  return (
    <div className="bg-[url('/personalcenter_bg.png')] bg-cover bg-right sm:bg-center bg-no-repeat sm:h-[1080px]">
      <NavBarWrapper />
      {/* 数据卡片容器 */}
      <div className="container mx-auto px-4 pt-8">
        {/* 上排单个卡片，内含三组数据 */}
        <div className="mb-4">
          <div className="bg-[url('/personal01.png')] bg-cover bg-center h-40 rounded-lg">
            <div className="h-full flex justify-around items-center text-white">
              <div className="flex flex-col items-center">
                <div className="flex items-baseline">
                  <div className="text-4xl font-bold">
                    {userInfo?.shares || 0}
                  </div>
                  <div className="text-2xl font-bold text-gray-300 ml-2">
                    sui
                  </div>
                </div>
                <br />
                <div className="text-xl text-gray-300">分享地址</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="flex items-baseline">
                  <div className="text-4xl font-bold">
                    {userInfo?.teams || 0}
                  </div>
                  <div className="text-2xl font-bold text-gray-300 ml-2">
                    个
                  </div>
                </div>
                <br />
                <div className="text-xl text-gray-300">团队地址</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="flex items-baseline">
                  <div className="text-4xl font-bold"></div>
                  <div className="text-2xl font-bold text-gray-300 ml-2">
                    个
                  </div>
                </div>
                <br />
                <div className="text-xl text-gray-300">个人认购</div>
              </div>
            </div>
          </div>
        </div>
        {/* 下排两个卡片 */}
        <div className="flex justify-between gap-4">
          <div className="flex-1 bg-[url('/personal02.png')] bg-cover bg-center h-40 rounded-lg flex flex-col justify-center items-center text-white">
            <div className="flex items-baseline">
              <div className="text-4xl font-bold">297</div>
              <div className="text-2xl font-bold text-gray-300 ml-2">sui</div>
            </div>
            <br />
            <div className="text-xl text-gray-300">已领取收益</div>
          </div>
          <div className="flex-1 bg-[url('/personal03.png')] bg-cover bg-center h-40 rounded-lg flex flex-col justify-center items-center text-white">
            <div className="flex items-baseline">
              <div className="text-4xl font-bold">297</div>
              <div className="text-2xl font-bold text-gray-300 ml-2">sui</div>
            </div>
            <br />
            <div className="text-xl text-gray-300">团队总认购</div>
          </div>
        </div>
      </div>

      {/* 三个组件垂直排列，宽度与上方卡片对齐 */}
      <div className="container mx-auto px-4 mt-8">
        <div className="flex flex-col gap-4">
          <div className="w-full">
            <Share />
          </div>
          <div className="w-full">
            <Recommender />
          </div>
          <div className="w-full">
            <BindAddressList />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
