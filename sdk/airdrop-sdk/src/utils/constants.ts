export const getConfig = (network: 'mainnet' | 'testnet') => {
  if (network === 'testnet') {
    return {
      package: {
        packageId:
          '0x825342a40839424be4b2c644192822b7199eda1b84bf255c0ad1b0e5279cdf7d',
        outdated: [
          {
            packageId:
              '0x8752effbf2371027fc61aea1e4aecc1a6da03222615fc10f56810f8734fe116c',
            version: 2,
          },
          {
            packageId:
              '0x4cf1ba43864fc8a76250cd18ea8b6e92745c5ee7191122f60bf2fb89ff34840a',
            version: 1,
          },
        ],
      },
      ADMIN_CAP:
        '0x83b5a87b517b91cb81350247b3bc48640263bda5047e929d14ad50d103354b9e',
      UPGRADE_CAP:
        '0x5c5b6498960a3d8bbc974fcc52ca0a71feab1ddae60dff6e62543b580d53d321',
      INVITE:
        '0x150f925eb8639497009df894c58051410f277a71fe007389a865b316ad4b017c',
      NODES:
        '0x53908d87401cbe75b843eaf1ed23d905b3c345c3af717c082801d07d202c1554',
      AIRDROPS:
        '0x494e29cfa046bd494f11d2c8d7fa0ee706f8bdce166c2aa1add1f13c490f5265',
      GLOBAL:
        '0x406c50a93652955df836f80dd81e679c6b8eed7f5b4b3c64fcca538620d46ffb',
      LIMITS:
        '0x515808f8cd404eeda3f43338fb73bf7d6d454061ff42c035ca8a81853f910620',
      INVEST:
        '0x03d159659a1774f4328ed379610b1f7c45713757b93d91ab42d9f126bd227986',
      PAY_COIN_TYPE: '0x2::sui::SUI',
    };
  } else {
    return {
      package: {
        packageId:
          '0x3a2f575f290e6232c23d1fb67bced9eba734a5bfb2e1b66f0604709f0e7d01ac',
        outdated: [
          {
            packageId:
              '0x8b3bbb05feb9245f0b5c80008c75929c82beef7c8b4a8f7ceac26b9bf7e7bafb',
            version: 2,
          },
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
      GLOBAL:
        '0x38cae477c4c7b46e9afc0e8969d264f73c3830147ec43c5b9f79f1a271697062',
      LIMITS:
        '0xa2474ac5beb399f2afcc158dd51368050b6c3af93f42300032537ddabda86a5a',
      INVEST:
        '0x542ecad243608a5a6defe2d209dca707c657bf6698923c6df8e7b1492d230e0d',
      PAY_COIN_TYPE: '0x2::sui::SUI',
    };
  }
};

export * from './constants';
