const Block = require("./block");
const Blockchain = require("./blockchain");

describe("blockchain", () => {
  let blockchain,
    newChain,
    originalChain = new Blockchain();
  beforeEach(() => {
    blockchain = new Blockchain();
    newChain = new Blockchain();
    originalChain = blockchain.chain;
  });

  it("contains a 'chain' array instance", () => {
    expect(blockchain.chain instanceof Array).toBe(true);
  });
  it("starts with the genesis block", () => {
    expect(blockchain.chain[0]).toEqual(Block.genesis());
  });
  it("adds a new block to the chain", () => {
    const newData = "foo bar";
    blockchain.addBlock({ data: newData });
    expect(blockchain.chain[blockchain.chain.length - 1].data).toEqual(newData);
  });
  describe("isValidChain()", () => {
    describe("when chain dosnt start with genesis block", () => {
      it("returns false", () => {
        blockchain.chain[0] = { data: "fake-genesis" };
        expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
      });
    });

    describe("when chain does start with genesis block and has multiple blocks", () => {
      beforeEach(() => {
        blockchain.addBlock({ data: "one" });
        blockchain.addBlock({ data: "two" });
        blockchain.addBlock({ data: "three" });
      });
      describe("and a lastHash refrence has changed", () => {
        it("returns false", () => {
          blockchain.chain[2].lastHash = "broken-lastHash";
          expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
        });
      });
      describe("and the chain contains a block with an invalid field", () => {
        it("returns false", () => {
          blockchain.chain[2].data = "changed-data";
          expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
        });
      });
      describe("and the chain does not contains any invalid blocks", () => {
        it("returns true", () => {
          blockchain = new Blockchain();
          expect(Blockchain.isValidChain(blockchain.chain)).toBe(true);
        });
      });
    });
  });
  describe("replaceChain()", () => {
    describe("when the newChain is shorter than mainChain", () => {
      it("dos'nt replace the chain", () => {
        newChain[0] = { new: "chain" };
        blockchain.replaceChain(newChain.chain);
        expect(blockchain.chain).toEqual(originalChain);
      });
    });
    describe("when the newChain is longer than mainChain", () => {
      beforeEach(() => {
        newChain.addBlock({ data: "one" });
        newChain.addBlock({ data: "two" });
        newChain.addBlock({ data: "three" });
      });
      describe("and the chain is invalid", () => {
        it("dos'nt replace the chain", () => {
          newChain.chain[1].hash = "changed-hash";
          blockchain.replaceChain(newChain.chain);
          expect(blockchain.chain).toEqual(originalChain);
        });
      });
      describe("and the chain is valid", () => {
        it("dose replace the chain", () => {
          blockchain.replaceChain(newChain.chain);
          console.log(blockchain.chain);
          console.log(newChain.chain);

          expect(blockchain.chain).toEqual(newChain.chain);
        });
      });
    });
  });
});
