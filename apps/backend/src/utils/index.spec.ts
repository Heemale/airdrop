describe('Test', () => {
  it('should return "Hello World!"', () => {
    const now = 10030007995340900000n;
    const expect = 2n ** 64n - 1n;
    const need = BigInt(expect) - now;
    console.log({ need });
    console.log(need + now);
  });
});
