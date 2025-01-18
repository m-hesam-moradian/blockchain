const redis = require("redis");

const CHANNELS = {
  TEST: "TEST",
};

class PubSub {
  constructor() {
    // Create publisher and subscriber clients
    this.publisher = redis.createClient();
    this.subscriber = redis.createClient();

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

  handleMessage(channel, message) {
    console.log(`Message received. Channel: ${channel}. Message: ${message}`);
  }

  async publish(channel, message) {
    // Publish a message to the specified channel
    await this.publisher.publish(channel, message);
  }
}

// Initialize PubSub and send a message after 1 second
(async () => {
  const testPubSub = new PubSub();

  // Wait for initialization
  setTimeout(async () => {
    await testPubSub.publish(CHANNELS.TEST, "foo");
  }, 1000);
})();
