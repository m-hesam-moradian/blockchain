const Block = require("./block");

class blockchain {
  constructor(parameters) {
    this.chain = [Block.genesis()];
  }
  addBlock({ data }) {
    const newblock = Block.mineBlock({
      lastBlock: this.chain[this.chain.length - 1],
      data,
    });
    this.chain.push(newblock)
  }
}
module.exports = blockchain;
