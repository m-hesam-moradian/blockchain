// Importing configuration data (GENESIS_DATA) and mine rate (MINE_RATE) from the config file.
const { GENESIS_DATA, MINE_RATE } = require("./config");
// Importing the cryptoHash utility to generate hashes.
const cryptoHash = require("./crypto-hash");

// Block class representing each block in the blockchain.
class Block {
  // The constructor defines the properties of a block.
  constructor({ timestamp, lastHash, hash, data, difficulty, nonce }) {
    this.timestamp = timestamp; // Timestamp when the block was created.
    this.lastHash = lastHash; // Hash of the previous block.
    this.hash = hash; // Hash of the current block.
    this.data = data; // Data stored in the block (usually transactions).
    this.difficulty = difficulty; // The difficulty level for mining the block.
    this.nonce = nonce; // Nonce is used in the mining process (a counter).
  }

  // Static method to generate the genesis (first) block using predefined genesis data.
  static genesis() {
    return new this(GENESIS_DATA); // Returns a new Block instance with the genesis data.
  }

  // Static method to mine a new block based on the previous block's hash and data.
  static mineBlock({ lastBlock, data }) {
    let hash, timestamp;
    const lastHash = lastBlock.hash; // Hash of the previous block.
    let { difficulty } = lastBlock; // The difficulty level from the previous block.
    let nonce = 0; // Initial nonce value (used to vary the hash and meet difficulty requirements).

    // Loop to find a valid block hash (with a required number of leading zeros).
    do {
      nonce++; // Increment nonce value to try a new hash.
      timestamp = Date.now(); // Get current time (used to set timestamp for the new block).

      // Adjust difficulty based on the time difference between the current and previous block.
      difficulty = Block.adjustDifficulty({
        originalBlock: lastBlock,
        timestamp,
      });

      // Generate a hash based on timestamp, last hash, data, nonce, and difficulty.
      hash = cryptoHash(timestamp, lastHash, data, nonce, difficulty);
    } while (hash.substring(0, difficulty) !== "0".repeat(difficulty)); // Ensure the hash has the required number of leading zeros.

    // Return a new Block instance with the mined values.
    return new this({
      timestamp,
      lastHash,
      data: data,
      difficulty,
      nonce,
      hash,
    });
  }

  // Static method to adjust the difficulty for mining based on time taken to mine the last block.
  static adjustDifficulty({ originalBlock, timestamp }) {
    const { difficulty } = originalBlock; // Difficulty of the previous block.

    // If difficulty is less than 1, set it to 1 (difficulty can't go below 1).
    if (difficulty < 1) return 1;

    // If the time to mine the block exceeds the MINE_RATE, decrease the difficulty.
    if (timestamp - originalBlock.timestamp > MINE_RATE) return difficulty - 1;

    // Otherwise, increase the difficulty for the next block.
    return difficulty + 1;
  }
}

// Exporting the Block class to be used elsewhere in the application (e.g., in the blockchain class).
module.exports = Block;
