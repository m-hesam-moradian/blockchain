class Block {
  constructor(data, hash, lastHash) {
    this.data = data;
    this.hash = hash;
    this.lastHash = lastHash;
  }
}
class Blockchain {
  constructor(chain) {
    this.chain = [];
  }
}
const hashFunc = (input) => {
  return "*" + input + "*";
};
