const mongoose = require("mongoose");

const connectionString = "mongodb://localhost:27017/shopDev";

const TestSchema = await mongoose.Schema({ nameTest: String });

const Test = mongoose.model("Test", TestSchema);

describe("Mongoose connection", () => {
  let connection;
  //create connection
  beforeAll(async () => {
    connection = await mongoose.connect(connectionString);
  });
  //close connection to mongoose
  afterAll(async () => {
    await connection.close();
  });
  it("Show connection to mongoose", () => {
    expect(mongoose.connection.readyState).toBe();
  });
  it("Show have a connection to the db", async () => {
    const user = new Test({ nameTest: "Tests" });
    await user.save();
    expect(user.isNew).toBe(false);
  });
});
