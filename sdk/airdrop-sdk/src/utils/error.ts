export const ERROR_CODE: Record<string, Record<string, string>> = {
  airdrop: {
    '1': 'ECoinBalanceNotEnough',
    '2': 'ERoundNotFound',
    '3': 'ERoundExited',
    '4': 'EInvalidClaimTime',
    '5': 'ENoRemainingShares',
    '6': 'EMethodDeprecated',

  },
  node: {
    '1': 'ECoinBalanceNotEnough',
    '2': 'EAlreadyBuyNode',
    '3': 'ENotBuyNode',
    '4': 'ENodeSoldOut',
    '5': 'EExceedsPurchaseLimit',
    '6': 'EInvalidCoinType',
    '7': 'ENodeNotOpen',
    '9': 'EMethodDeprecated',
    '8': 'EInsufficientRemainingQuantity',
    '10': 'ENoNeedBuyNode',
    '11': 'EMustActiveNode',
    '12': 'EInvalidReceiver',
    '13': 'EExceedsClaimLimit',


  },
  invite: {
    '1': 'EInvalidSender',
    '2': 'EInvalidInviter',
    '3': 'EAlreadyBindInviter',
    '4': 'ENotBindInviter',
    '5': 'EMethodDeprecated',
  },
  global: {
    '0': 'EPaused',
    '1': 'EInvalidObject',
  },
};

export * from './error';
