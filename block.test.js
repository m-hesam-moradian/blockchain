const Block = require("./block");

describe("Block", () => {
  const timeStamp = "123456";
  const lastHash = "foo-lastHash";
  const hash = "foo-hash";
  const data = ["blockchain", "data"];

  const block = new Block({
    timeStamp: timeStamp,
    lastHash: lastHash,
    hash: hash,
    data: data,
  });
  it("has a timestamp lastHash hash and data property", () => {
    expect(block.timeStamp).toEqual(timeStamp);
    expect(block.lastHash).toEqual(lastHash);
    expect(block.hash).toEqual(hash);
    expect(block.data).toEqual(data);
  });
});
