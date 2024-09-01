const amqplib = require("amqplib");

const connectToRabbitMq = async () => {
  try {
    const connection = await amqplib.connect("amqp://guest:12345@localhost");
    const channel = await connection.createChannel();
    return { connection, channel };
  } catch (error) {
    console.log(error);
  }
};

const connectToRabbitMqForTesting = async () => {
  try {
    const { channel, connection } = await connectToRabbitMq();
    //publish message
    const queue = "test";
    const message = "Hello, shopDev";
    await channel.assertQueue(queue);
    await channel.sendToQueue(queue, Buffer.from(message));
    await connection.close();
  } catch (error) {
    console.log(error);
  }
};

const consumerQueue = async (channel, queue) => {
  try {
    await channel.assertQueue(queue, { durable: true });
    console.log("waiting mess");
    channel.consume(
      queue,
      (msg) => {
        console.log("Received mess:", msg.content.toString());
        //find user follow
        // send message to user
        // yes, ok=>> success
        //4 .error, setup DLX
      },
      { noAck: true }
    );
  } catch (error) {
    console.log(error);
    throw error;
  }
};

module.exports = {
  connectToRabbitMq,
  connectToRabbitMqForTesting,
  consumerQueue,
};
