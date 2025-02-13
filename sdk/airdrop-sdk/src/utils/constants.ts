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
          '0xf7f877b7fb4ba945e3c3f4805a7e05588a72f001e41f82aac41defcbfdd42768',
        outdated: [
          {
            packageId:
              '0xf7f877b7fb4ba945e3c3f4805a7e05588a72f001e41f82aac41defcbfdd42768',
            version: 2,
          },
          {
            packageId:
              '0xc817d2ec33635da00c74b4f0e315cf67af945d20669c4d347be9a453bf4b03a5',
            version: 1,
          },
        ],
      },
      ADMIN_CAP:
        '0x4a21de0c6b46faa39900bc7141047fa4e0a40129badb02af797d3aff20362747',
      UPGRADE_CAP:
        '0xa952fcf320aee419ed732750eecdede7184e3b4f8b9ffbbebb8f7edb454904bb',
      INVITE:
        '0x7ea4d2926e1b36a2eacceb1453a38a17bf4c694217f8bbad7470e3de95394f45',
      NODES:
        '0xdca2b321a34c3ea0f3ed46293e5feb0df61fc5ce20b91fa47d0ea3cfd42bfb57',
      AIRDROPS:
        '0x4cb77de15eda9590fad786a41c742d1b17360c4d93ea4332acfaaa61cfb67f18',
      GLOBAL:
        '0x16d0f62d38a29011e8cc0162c612070d0c6879de2567c7c45c10f42da3dcefab',
      LIMITS:
        '0xbd41cd3234467b9dac302de545229361449f1a47c891c28ed41969c9786355bf',
      INVEST:
        '0x9938fe842e626ce01a35045f69098fa95d4a83837a8754ae9dc6c1b288d2b24e',
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
