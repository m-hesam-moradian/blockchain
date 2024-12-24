const Block = require("./block");
const cryptoHash = require("./crypto-hash");

class blockchain {
  constructor(parameters) {
    this.chain = [Block.genesis()];
  }
  addBlock({ data }) {
    const newblock = Block.mineBlock({
      lastBlock: this.chain[this.chain.length - 1],
      data,
    });
    this.chain.push(newblock);
  }
  static isValidChain(chain) {
    if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) {
      return false;
    }
    for (let i = 1; i < chain.length; i++) {
      const block = chain[i];
      const actualLastHash = chain[i - 1].hash;
      const { timeStamp, lastHash, hash, data } = block;
      if (lastHash != actualLastHash) return false;
      if (hash !== cryptoHash(timeStamp, lastHash, data)) return false;
    }
    return true;
  }
}
module.exports = blockchain;
