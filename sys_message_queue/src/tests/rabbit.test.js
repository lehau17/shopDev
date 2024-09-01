const { connectToRabbitMqForTesting } = require("../dbs/rabbitMQ.connect");

describe("RabbitMQ connect", () => {
  it("should connect to successfully", async () => {
    const result = await connectToRabbitMqForTesting();
    expect(result).toBeUndefined();
  });
});
