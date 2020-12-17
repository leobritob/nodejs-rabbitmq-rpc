import { v4 as uuid } from 'uuid'
import { Channel, Connection, ConsumeMessage, Replies } from 'amqplib'

export class RpcClient {
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

  async assert(): Promise<Replies.AssertQueue> {
    const assert = await this.channel.assertQueue('', { exclusive: true })
    this.queue = assert.queue
    return assert
  }

  async consume(correlationId: string): Promise<Replies.Consume> {
    const options = { noAck: true }

    return await this.channel.consume(this.queue, (message) => this.handleMessages(message, correlationId), options)
  }

  async sendMessage(message: string, correlationId: string) {
    const content = Buffer.from(JSON.stringify(message))
    const options = { correlationId, replyTo: this.queue }

    this.channel.sendToQueue(this.queueName, content, options)

    console.log(`-> Message sent successfully: ${message}`)
  }

  async run(message: string) {
    await this.createChannel()
    await this.assert()

    const correlationId = uuid()
    await this.consume(correlationId)
    await this.sendMessage(message, correlationId)
  }

  private handleMessages(message: ConsumeMessage | null, correlationId: string): void {
    if (!message) return

    if (message.properties.correlationId == correlationId) {
      const content = message.content.toString()

      console.log(`<- Message sent successfully: ${content}`)

      this.closeProcess()
    }
  }

  private closeProcess(): void {
    setTimeout(() => {
      this.connection.close()
      process.exit(0)
    }, 200)
  }
}
