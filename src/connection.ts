import amqp, { Connection } from 'amqplib'

export class AmqpConnection {
  private readonly host = process.env.AMQP_HOST
  private readonly port = process.env.AMQP_PORT

  async connect(): Promise<Connection | undefined> {
    try {
      return await amqp.connect(`${this.host}:${this.port}`)
    } catch (e) {
      console.error(`Connection error - ${e.message}`)
    }
  }
}
