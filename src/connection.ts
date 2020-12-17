import amqp, { Channel, Connection } from 'amqplib'
import * as dotenv from 'dotenv'
dotenv.config()

export class AmqpConnection {
  private readonly host = process.env.AMQP_HOST
  private readonly port = process.env.AMQP_PORT
  private connection!: Connection

  async createChannel(): Promise<Channel> {
    return await this.connection.createChannel()
  }

  async connect(): Promise<Connection | undefined> {
    try {
      const connection = await amqp.connect(`${this.host}:${this.port}`)
      this.connection = connection
      return connection
    } catch (e) {
      console.error(`Connection error - ${e.message}`)
    }
  }
}
