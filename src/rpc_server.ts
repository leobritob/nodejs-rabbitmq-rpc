import { Connection, Channel, Replies, ConsumeMessage } from 'amqplib'

export class RpcServer {
  private readonly connection: Connection
  private channel!: Channel
  private queue!: string
  private queueName: string

  constructor({ queueName, connection }: { queueName: string; connection: Connection }) {
    this.queueName = queueName
    this.connection = connection
  }

  async createChannel(): Promise<Channel> {
    const channel = await this.connection.createChannel()
    this.channel = channel
    return channel
  }

  async assert(): Promise<Replies.AssertQueue | undefined> {
    const assert = await this.channel.assertQueue(this.queueName, { durable: false })
    await this.channel.prefetch(1)

    this.queue = assert.queue
    return assert
  }

  async sendMessage(replyToQueueName: string, message: Buffer, correlationId: string) {
    if (this.channel) {
      this.channel.sendToQueue(replyToQueueName, message, { correlationId })
      console.log(`-> Message sent successfully: ${message}`)
    }
  }

  async consume(): Promise<Replies.Consume> {
    return await this.channel.consume(this.queue, this.handleMessage, { noAck: true })
  }

  async run() {
    await this.createChannel()
    await this.assert()
    await this.consume()
  }

  private handleMessage(msg: ConsumeMessage | null): void {
    if (!msg) return

    const data = JSON.parse(msg.content.toString())
    console.log(`<- Message received successfully: ${data}`)

    this.sendMessage(msg.properties.replyTo, msg.content, msg.properties.correlationId)
  }
}
