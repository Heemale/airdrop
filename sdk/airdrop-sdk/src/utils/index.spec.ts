import { getType, extractErrorCodeAndModule } from '.';

describe('Test Utils', () => {
  it('getType', async () => {
    const str =
      '0xc17967db226ad545902144385738e6b99588f970bc47adf5fcf70080cb16ddcc::prediction::Prediction<0xa60797870293970fb8dc39915f4c60e1fc32d5a1bf5cb85308c24428d947567f::ai::AI>';
    const data = getType(str);
    const expectData =
      '0xa60797870293970fb8dc39915f4c60e1fc32d5a1bf5cb85308c24428d947567f::ai::AI';
    expect(data).toStrictEqual(expectData);
  });

  // it('extractErrorCodeAndModule', async () => {
  //   const error =
  //     'ExecutionError: ExecutionError { inner: ExecutionErrorInner { kind: MoveAbort(MoveLocation { module: ModuleId { addres\n' +
  //     's: 0xcc127d30e10942d166773c7f8ffe06483efd31578685834ec75e090ae0dde140, name: Identifier("airdrop") }, function: 4, instruction: 12, \n' +
  //     'function_name: Some("invite") }, 10086), source: Some(VMError { major_status: ABORTED, sub_status: Some(10086), message: Some("0x079cea645\n' +
  //     '5be8b4609fe5271d7f33c4df132413f9ed0cc598e5099304b13884c::airdrop::invite at offset 12"), exec_state: None, location: Module(Module\n' +
  //     'Id { address: 0xcc127d30e10942d166773c7f8ffe06483efd31578685834ec75e090ae0dde140, name: Identifier("airdrop") }), indices: [], offse\n' +
  //     'ts: [(FunctionDefinitionIndex(4), 12)] }), command: Some(0) } }';
  //   const data = extractErrorCodeAndModule(error);
  //   const expectErrorCode = 10086;
  //   const expectModule = 'airdrop';
  //   expect(data.errorCode).toStrictEqual(expectErrorCode);
  //   expect(data.module).toStrictEqual(expectModule);
  // });

  it('extractErrorCodeAndModule', async () => {
    const error =
      'Claim: Transaction failed with the following error. Dry run failed, could not automatically determine a budget: MoveAbort(MoveLocation { module: ModuleId { address: 0ee2ffaae5bb8990206d745618e91835705250e6e208daf9ad19866d73e5da21, name: Identifier("airdrop") }, function: 15, instruction: 24, function_name: Some("assert_invalid_claim_time") }, 4) in command 0';
    const data = extractErrorCodeAndModule(error);
    const expectErrorCode = 4;
    const expectModule = 'airdrop';
    expect(data.errorCode).toStrictEqual(expectErrorCode);
    expect(data.module).toStrictEqual(expectModule);
  });
});
