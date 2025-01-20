const redis = require("redis");
const Blockchain = require("./blockchain");

const CHANNELS = {
  TEST: "TEST",
  Blockchain: "Blockchain",
};

class PubSub {
  constructor({ blockchain }) {
    // Create publisher and subscriber clients
    this.blockchain = blockchain;
    this.publisher = redis.createClient();
    this.subscriber = redis.createClient();

    this.subscribeToChannels();
    // Connect both clients
    this.init();
  }

  async init() {
    // Connect publisher and subscriber
    await this.publisher.connect();
    await this.subscriber.connect();

    // Subscribe to the TEST channel
    await this.subscriber.subscribe(CHANNELS.TEST, (message) => {
      this.handleMessage(CHANNELS.TEST, message);
    });

    console.log("PubSub system initialized.");
  }
  subscribeToChannels() {
    Object.values(CHANNELS).forEach((channel) => {
      this.subscriber.subscribe(channel);
    });
  }

  publish({ channel, message }) {
    this.publisher.publish(channel, message);
  }
  broadcatChain() {
    this.publish({
      channel: CHANNELS.Blockchain,
      message: JSON.stringify(this.blockchain.channel),
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
