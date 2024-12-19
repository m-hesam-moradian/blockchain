const cryptoHash = require("./crypto-hash");

describe(cryptoHash(), () => {
  it("generate a sha-256 hashed output", () => {
    expect(cryptoHash("hesam")).toEqual(
      "73aa703ca0ccac9332f78e24a974554e8979b48104497c26110bb03ffadc56cc"
    );
  });
  it("produce same hash with the same input in any order", () => {
    expect(cryptoHash("one", "two", "three")).toEqual(
      cryptoHash("one", "two", "three")
    );
  });
});
