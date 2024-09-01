const { consumerQueue, connectToRabbitMq } = require("../dbs/rabbitMQ.connect");

const messageService = {
  consumerToQueue: async (queueName) => {
    try {
      const { connection, channel } = await connectToRabbitMq();
      await consumerQueue(channel, queueName);
    } catch (error) {
      console.error(error);
    }
  },
};

module.exports = messageService;
