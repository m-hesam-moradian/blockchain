class Block {
  constructor(data, hash, lastHash) {
    this.data = data;
    this.hash = hash;
    this.lastHash = lastHash;
  }
}
class Blockchain {
  constructor() {
    const genesisBLock = new Block("gen-data", "gen-hash", "gen-lastHash");
    this.chain = [genesisBLock];
  }
  addBlock(data) {
    const lastHash = this.chain[this.chain.length - 1].hash;
    const hash = hashFunc(data + lastHash);
    const block = new Block(data, hash, lastHash);
    this.chain.push(block);
  }
}
const hashFunc = (input) => {
  return "*" + input + "*";
};

const fooBlockchain = new Blockchain();
fooBlockchain.addBlock("one");
fooBlockchain.addBlock("two");
fooBlockchain.addBlock("three");
console.log(fooBlockchain);
