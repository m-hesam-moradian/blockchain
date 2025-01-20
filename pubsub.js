const redis = require("redis");
const Blockchain = require("./blockchain");

const CHANNELS = {
  TEST: "TEST",
  Blockchain: "Blockchain",
};

class PubSub {
  constructor({ blockchain }) {
    this.blockchain = blockchain;
    this.publisher = redis.createClient();
    this.subscriber = redis.createClient();

    this.init();
  }

  async init() {
    try {
      await this.publisher.connect();
      await this.subscriber.connect();

      this.subscribeToChannels();

      console.log("PubSub system initialized.");
    } catch (error) {
      console.error("Error initializing PubSub:", error);
    }
  }

  subscribeToChannels() {
    Object.values(CHANNELS).forEach(async (channel) => {
      await this.subscriber.subscribe(channel);
    });

    this.subscriber.on("message", (channel, message) => {
      this.handleMessage(channel, message);
    });
  }

  async publish({ channel, message }) {
    try {
      await this.publisher.publish(channel, message);
    } catch (error) {
      console.error(`Error publishing to channel ${channel}:`, error);
    }
  }

  broadcastChain() {
    this.publish({
      channel: CHANNELS.Blockchain,
      message: JSON.stringify(this.blockchain.chain),
    });
  }

  handleMessage(channel, message) {
    const parsedMessage = JSON.parse(message);

    if (channel === CHANNELS.Blockchain) {
      this.blockchain.replaceChain(parsedMessage);
    }

    console.log(`Message received. Channel: ${channel}. Message: ${message}`);
  }
}

module.exports = PubSub;
