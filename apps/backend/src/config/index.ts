import 'dotenv/config';

export const RPC = process.env.SUI_FULL_NODE!;
export const SUI_NETWORK = process.env.SUI_NETWORK! as 'mainnet' | 'testnet';
export const TOKEN_DECIMAL = '9';
