'use client';

import * as React from 'react';
import { useEffect, useState } from 'react';
import NavBarWrapper from '@/components/NavBarWrapper';
import { useCurrentAccount } from '@mysten/dapp-kit';
import Share from '@/components/PersonalCenter/Share';
import Recommender from '@/components/PersonalCenter/Recommender';
import BindAddressList from '@/components/PersonalCenter/BindAddressList';
import { getUserInfo } from '@/api';
import { useClientTranslation } from '@/hook';
import { message } from 'antd';
import { handleTxError } from '@/sdk/error';
import type { UserInfoResponse } from '@/api/types/response';

const Home = () => {
  const account = useCurrentAccount();
  const { t } = useClientTranslation();

  const [userInfo, setUserInfo] = useState<UserInfoResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [messageApi, contextHolder] = message.useMessage();

  // 获取用户信息
  useEffect(() => {
    const fetchUserInfo = async () => {
      if (account?.address) {
        try {
          setLoading(true);
          const data = await getUserInfo({
            sender: account.address,
          });
          if (data) {
            setUserInfo(data);
          } else {
            message.error(t('Unable to obtain user information'));
          }
        } catch (e: any) {
          console.log(`Failed to fetch UserInfo: ${e.message}`);
          messageApi.error(`${t(handleTxError(e.message))}`);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUserInfo();
  }, [account]);

  return (
    <div className="bg-[url('/personal_center_bg.png')] bg-cover bg-right sm:bg-center bg-no-repeat sm:h-[1080px]">
      <NavBarWrapper />
      {/* 数据卡片容器 - 缩小最大宽度 */}
      <div className="container mx-auto px-4 pt-8 max-w-5xl">
        {/* 上排单个卡片 - 减小高度 */}
        <div className="mb-4">
          <div className="bg-[url('/personal01.png')] bg-cover bg-center h-32 rounded-lg">
            <div className="h-full flex justify-around items-center text-white">
              <div className="flex flex-col items-center">
                <div className="flex items-baseline">
                  <div className="text-3xl font-bold">
                    {userInfo?.shares || 0}
                  </div>
                  <div className="text-2xl font-bold text-gray-300 ml-2">
                    {t('indivual')}
                  </div>
                </div>
                <br />
                <div className="text-xl text-gray-300">
                  {t('share address')}
                </div>
              </div>
              <div className="flex flex-col items-center">
                <div className="flex items-baseline">
                  <div className="text-3xl font-bold">
                    {userInfo?.teams || 0}
                  </div>
                  <div className="text-2xl font-bold text-gray-300 ml-2">
                    {t('indivual')}
                  </div>
                </div>
                <br />
                <div className="text-xl text-gray-300">{t('team address')}</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="flex items-baseline">
                  <div className="text-3xl font-bold">
                    {userInfo?.totalInvestment || 0}
                  </div>
                  <div className="text-2xl font-bold text-gray-300 ml-2">
                    sui
                  </div>
                </div>
                <br />
                <div className="text-xl text-gray-300">
                  {t('Personal subscription')}
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* 下排两个卡片 - 减小高度 */}
        <div className="flex justify-between gap-4">
          <div className="flex-1 bg-[url('/personal02.png')] bg-cover bg-center h-32 rounded-lg flex flex-col justify-center items-center text-white">
            <div className="flex items-baseline">
              <div className="text-3xl font-bold">
                {userInfo?.totalGains || 0}
              </div>
              <div className="text-2xl font-bold text-gray-300 ml-2">sui</div>
            </div>
            <br />
            <div className="text-xl text-gray-300">{t('Earned')}</div>
          </div>
          <div className="flex-1 bg-[url('/personal03.png')] bg-cover bg-center h-32 rounded-lg flex flex-col justify-center items-center text-white">
            <div className="flex items-baseline">
              <div className="text-3xl font-bold">
                {userInfo?.teamTotalInvestment || 0}
              </div>
              <div className="text-2xl font-bold text-gray-300 ml-2">sui</div>
            </div>
            <br />
            <div className="text-xl text-gray-300">
              {t('Total team subscription')}
            </div>
          </div>
        </div>
      </div>

      {/* 三个组件容器 - 缩小最大宽度 */}
      <div className="container mx-auto px-4 mt-8 max-w-5xl">
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
