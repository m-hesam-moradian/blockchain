// Importing the Block class, GENESIS_DATA, MINE_RATE from config, and the cryptoHash utility for hash generation.
const Block = require("./block");
const { GENESIS_DATA, MINE_RATE } = require("./config");
const cryptoHash = require("./crypto-hash");

// Describe block testing suite for the Block class
describe("Block", () => {
  // Defining mock data for testing block creation
  const timestamp = 2000; // Timestamp of the block
  const lastHash = "foo-hash"; // Hash of the previous block
  const hash = "bar-hash"; // Hash of the current block
  const data = ["blockchain", "data"]; // Data inside the block (could be transactions, etc.)
  const difficulty = 1; // Difficulty level for mining
  const nonce = 1; // Nonce used in the mining process to generate a valid hash

  // Creating a new block instance for testing
  const block = new Block({
    timestamp,
    lastHash,
    hash,
    data,
    difficulty,
    nonce,
  });

  // Test: Ensure the Block instance has the correct properties
  it("has a timestamp, lastHash, hash and data property", () => {
    expect(block.timestamp).toEqual(timestamp); // Check the timestamp
    expect(block.lastHash).toEqual(lastHash); // Check the last block hash
    expect(block.hash).toEqual(hash); // Check the current block hash
    expect(block.data).toEqual(data); // Check the data stored in the block
    expect(block.difficulty).toEqual(difficulty); // Check the difficulty level
    expect(block.nonce).toEqual(nonce); // Check the nonce value
  });

  // Testing the static method `genesis()`, which creates the genesis block
  describe("genesis()", () => {
    const genesisblock = Block.genesis(); // Generate the genesis block

    it("returns a block instance", () => {
      // Ensure that the returned object is an instance of Block
      expect(genesisblock instanceof Block).toEqual(true);
    });

    it("returns the genesis data", () => {
      // Ensure that the genesis block matches the predefined GENESIS_DATA
      expect(genesisblock).toEqual(GENESIS_DATA);
    });
  });

  // Testing the static method `mineBlock()` which mines a new block
  describe("mineBlock()", () => {
    const lastBlock = Block.genesis(); // Using the genesis block as the last block
    const data = "mined data"; // Data to be stored in the new block
    const minedBlock = Block.mineBlock({ lastBlock, data }); // Mine a new block

    it("returns a block instance", () => {
      // Ensure that the mined block is an instance of Block
      expect(minedBlock instanceof Block).toEqual(true);
    });

    it("sets the `lastHash` to the `hash` of the lastBlock", () => {
      // Ensure that the `lastHash` of the mined block is the `hash` of the previous block
      expect(minedBlock.lastHash).toEqual(lastBlock.hash);
    });

    it("sets the `data`", () => {
      // Ensure that the mined block contains the correct `data`
      expect(minedBlock.data).toEqual(data);
    });

    it("sets the `timestamp`", () => {
      // Ensure that the timestamp is set in the mined block
      expect(minedBlock.timestamp).not.toEqual(undefined);
    });

    it("creates a SHA-256 `hash` based on the proper inputs", () => {
      // Ensure that the hash is created using the correct inputs
      expect(minedBlock.hash).toEqual(
        cryptoHash(
          minedBlock.timestamp,
          minedBlock.nonce,
          minedBlock.difficulty,
          lastBlock.hash,
          data
        )
      );
    });

    it("sets a `hash` that meets the difficulty criteria", () => {
      // Ensure that the hash of the mined block satisfies the difficulty condition
      expect(minedBlock.hash.substring(0, minedBlock.difficulty)).toEqual(
        "0".repeat(minedBlock.difficulty)
      );
    });

    it("adjusts the difficulty", () => {
      // Ensure that the difficulty is properly adjusted based on the mining time
      const possibleResults = [
        lastBlock.difficulty + 1, // If mining is fast, increase difficulty
        lastBlock.difficulty - 1, // If mining is slow, decrease difficulty
      ];
      expect(possibleResults.includes(minedBlock.difficulty)).toBe(true);
    });
  });

  // Testing the static method `adjustDifficulty()`, which adjusts the mining difficulty
  describe("adjustDifficulty()", () => {
    it("raises the difficulty for a quickly mined block", () => {
      // Simulate a faster mining process by decreasing the timestamp difference
      expect(
        Block.adjustDifficulty({
          originalBlock: block,
          timestamp: block.timestamp + MINE_RATE - 100, // Faster mining
        })
      ).toEqual(block.difficulty + 1); // Difficulty should increase
    });

    it("lowers the difficulty for a slowly mined block", () => {
      // Simulate a slower mining process by increasing the timestamp difference
      expect(
        Block.adjustDifficulty({
          originalBlock: block,
          timestamp: block.timestamp + MINE_RATE + 100, // Slower mining
        })
      ).toEqual(block.difficulty - 1); // Difficulty should decrease
    });

    it("has a lower limit of 1", () => {
      // Test that the difficulty cannot go below 1
      block.difficulty = -1;
      expect(Block.adjustDifficulty({ originalBlock: block })).toEqual(1); // Difficulty should be at least 1
    });
  });
});
