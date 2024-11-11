import { getType } from '.';

describe('Test Utils', () => {
  it('getType', async () => {
    const str =
      '0xc17967db226ad545902144385738e6b99588f970bc47adf5fcf70080cb16ddcc::prediction::Prediction<0xa60797870293970fb8dc39915f4c60e1fc32d5a1bf5cb85308c24428d947567f::ai::AI>';
    const data = getType(str);
    const expectData =
      '0xa60797870293970fb8dc39915f4c60e1fc32d5a1bf5cb85308c24428d947567f::ai::AI';
    expect(data).toStrictEqual(expectData);
  });
});
