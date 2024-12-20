import {
  getType,
  extractErrorCodeAndModule,
  extractErrorCodeAndModuleByDev,
} from '.';
import { bcs } from '@mysten/sui/bcs';
import { SuiClient } from '@mysten/sui/client';
import { NodeClient } from "../node";
import {  NODES} from "../utils";

describe('Test Utils', () => {
  it('getType', async () => {
    const str =
      '0xc17967db226ad545902144385738e6b99588f970bc47adf5fcf70080cb16ddcc::prediction::Prediction<0xa60797870293970fb8dc39915f4c60e1fc32d5a1bf5cb85308c24428d947567f::ai::AI>';
    const data = getType(str);
    const expectData =
      '0xa60797870293970fb8dc39915f4c60e1fc32d5a1bf5cb85308c24428d947567f::ai::AI';
    expect(data).toStrictEqual(expectData);
  });

  it('extractErrorCodeAndModule', async () => {
    const error =
      'Claim: Transaction failed with the following error. Dry run failed, could not automatically determine a budget: MoveAbort(MoveLocation { module: ModuleId { address: 0ee2ffaae5bb8990206d745618e91835705250e6e208daf9ad19866d73e5da21, name: Identifier("airdrop") }, function: 15, instruction: 24, function_name: Some("assert_invalid_claim_time") }, 4) in command 0';
    const data = extractErrorCodeAndModule(error);
    const expectErrorCode = 4;
    const expectModule = 'airdrop';
    expect(data.errorCode).toStrictEqual(expectErrorCode);
    expect(data.module).toStrictEqual(expectModule);
  });

  it('extractErrorCodeAndModuleByDev', async () => {
    const error =
      'MoveAbort(MoveLocation { module: ModuleId { address: 81c4414f27bb029cc67a92aae489fe4365df99c28386b501bc5dcd502f107a26, name: Identifier("invite") }, function: 7, instruction: 19, function_name: Some("assert_invalid_inviter") }, 2) in command 0';
    const data = extractErrorCodeAndModuleByDev(error);
    const expectErrorCode = 2;
    const expectModule = 'invite';
    expect(data.errorCode).toStrictEqual(expectErrorCode);
    expect(data.module).toStrictEqual(expectModule);
  });

  it('receiver',async()=>{
    const suiclient = new SuiClient({url: 'https://fullnode.testnet.sui.io'});
    const nodeclient = new NodeClient(suiclient);
    const res =await nodeclient.receiver(NODES);
    console.log({ res });   
  // @ts-ignore
    console.log({ returnValues: res.results[0].returnValues });
  // @ts-ignore
    console.log(bcs.Address.parse(new Uint8Array(res?.results[0]?.returnValues[0][0])));}
)
});
