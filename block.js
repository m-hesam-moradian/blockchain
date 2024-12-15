class Block {
  constructor({timeStamp, lastHash, hash, data}) {
    this.timeStamp = timeStamp;
    this.lastHash = lastHash;
    this.hash = hash;
    this.data = data;
  }
}
const block1 = new Block("12344", "foo-lasHash", "foo-hash", "foo-data");
console.log(block1);
