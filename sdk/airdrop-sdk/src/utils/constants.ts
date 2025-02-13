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
        packageId:
          '0xac0684d466a96c467ce1f2e65b224cdf8c9064fb5524966cb65c508f4f4e3c85',
        outdated: [
          {
            packageId:
              '0xac0684d466a96c467ce1f2e65b224cdf8c9064fb5524966cb65c508f4f4e3c85',
            version: 2,
          },
          {
            packageId:
              '0xb87677cd27227d3bb33f93706340d3f3c576a6d46351c055b7c1f080f2560846',
            version: 1,
          },
        ],
      },
      ADMIN_CAP:
        '0xc2584aeff49810add129bbab0d6edb0c38734cb557ca04f73a876170ce5a1017',
      UPGRADE_CAP:
        '0xe1adcd72b6ed5195b393b72a13be3cc9b13d6e1cc360da9d283c6f102fe5147c',
      INVITE:
        '0x4be53ee5c674da50b9ef21223788babad8096fc33d4890e61057a14004317f4c',
      NODES:
        '0xe7ee0e8914fa735d91e7be190f2afa84dcd5607e6a0a544352ee262c74eda386',
      AIRDROPS:
        '0x56b603537898718ab70d9d4e2697f88f6bb2c30147dedeffc4090c23c9be402c',
      GLOBAL:
        '0xc5bd162fdeea75e1f832afb96a0a048855974b7b2b91540cc7ad82362e9c276b',
      LIMITS:
        '0x63c699db6f7b03182efae4fffbbb346b762ffdcd6ef898ea9135b7a90c9f4301',
      INVEST:
        '0xc00172f568638ae3b98f6a1ea386415f2f2b5b7c2e749e0f8ac152f6a329a092',
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
      GLOBAL: '',
      LIMITS: '',
      INVEST: '',
      PAY_COIN_TYPE: '0x2::sui::SUI',
    };
  }
};

export * from './constants';
