const { consumerToQueue } = require("./src/services/consumer.service");

const queueName = "test";
consumerToQueue(queueName)
  .then(() => {
    console.log("Message consumer started");
  })
  .catch((err) => {
    console.log(err);
  });
