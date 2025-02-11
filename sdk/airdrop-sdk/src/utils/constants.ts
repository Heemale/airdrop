export const PACKAGE_ID =
  '0x17192ccd391112180395ca60d6cd68ad97816ed1a8557e83c995c43c24b7a67f';

export const ADMIN_CAP =
  '0x7e0959ceb96b5d20959d219e86c1bd3f5c1411c22dc60b5b82511253f0e4874b';

export const UPGRADE_CAP =
  '0x371567cbf6ee6d0f2ba8b9c62151533cda0dcb3ffa7c57736370a8f8628e7211';

export const INVITE =
  '0x9a1df5c1e15a40534798dc2809919c1771078f8bb618ac4a7ef3cf7882c8c4c8';

export const NODES =
  '0x9982d11548a495a92d17fa144fd1b13c3115f1b789890ef80d1c256616bd7ea4';

export const AIRDROPS =
  '0xedd84d036dfda620c26c402edbe786473e0467a0a87aca7fe099c368768cfdb4';

export const PAY_COIN_TYPE = '0x2::sui::SUI';

export const getConfig = (network: 'mainnet' | 'testnet') => {
  if (network === 'testnet') {
    return {
      package: {
        packageId: '',
        outdated: [
          {
            packageId: '',
            version: 1,
          },
        ],
      },
      ADMIN_CAP: '',
      UPGRADE_CAP: '',
      INVITE: '',
      NODES: '',
      AIRDROPS: '',
      GLOBAL: '',
      LIMITS: '',
      INVEST: '',
      PAY_COIN_TYPE: '0x2::sui::SUI',
    };
  } else {
    return {
      package: {
        packageId:
          '0x17192ccd391112180395ca60d6cd68ad97816ed1a8557e83c995c43c24b7a67f',
        outdated: [
          {
            packageId:
              '0x17192ccd391112180395ca60d6cd68ad97816ed1a8557e83c995c43c24b7a67f',
            version: 1,
          },
        ],
      },
      ADMIN_CAP:
        '0x7e0959ceb96b5d20959d219e86c1bd3f5c1411c22dc60b5b82511253f0e4874b',
      UPGRADE_CAP:
        '0x371567cbf6ee6d0f2ba8b9c62151533cda0dcb3ffa7c57736370a8f8628e7211',
      INVITE:
        '0x9a1df5c1e15a40534798dc2809919c1771078f8bb618ac4a7ef3cf7882c8c4c8',
      NODES:
        '0x9982d11548a495a92d17fa144fd1b13c3115f1b789890ef80d1c256616bd7ea4',
      AIRDROPS:
        '0xedd84d036dfda620c26c402edbe786473e0467a0a87aca7fe099c368768cfdb4',
      PAY_COIN_TYPE: '0x2::sui::SUI',
    };
  }
};

export * from './constants';
