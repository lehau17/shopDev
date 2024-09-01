const amqplib = require('amqplib')
const producer = async () => {
  try {
    const connection = await amqplib.connect('amqp://guest:12345@localhost')

    const channel = await connection.createChannel()
    const queueName = 'test'
    await channel.assertQueue(queueName, { durable: true })
    channel.sendToQueue(queueName, Buffer.from('Hello consumer'))
    // setTimeout(() => connection.close(), process.exit(0), 5000)
    console.log('Kết nối thành công')
  } catch (error) {
    console.log(error)
    throw error
  }
}

producer()
