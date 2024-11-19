import { comparedTo } from '@/utils/math';

describe('Test Math', () => {
  it('comparedTo', async () => {
    // greater than
    const result = comparedTo('2', '1');
    expect(result).toBe(1);

    // less than
    const result2 = comparedTo('1', '2');
    expect(result2).toBe(-1);

    // equal
    const result3 = comparedTo('1', '1');
    expect(result3).toBe(0);
  });
});
