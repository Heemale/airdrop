export const ERROR_CODE: Record<string, Record<string, string>> = {
  airdrop: {
    '1': 'ECoinBalanceNotEnough',
    '2': 'ERoundNotFound',
    '3': 'ERoundExited',
    '4': 'EInvalidClaimTime',
    '5': 'ENoRemainingShares',
  },
  node: {
    '1': 'ECoinBalanceNotEnough',
    '2': 'EAlreadyBuyNode',
    '3': 'ENotBuyNode',
    '4': 'ENodeSoldOut',
    '5': 'EExceedsPurchaseLimit',
    '6': 'EInvalidCoinType',
  },
  invite: {
    '1': 'EInvalidSender',
    '2': 'EInvalidInviter',
    '3': 'EAlreadyBindInviter',
    '4': 'ENotBindInviter',
  },
};

export * from './error';
