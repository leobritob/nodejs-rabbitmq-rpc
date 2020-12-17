import { AmqpConnection } from './connection'
import { RpcServer } from './rpc_server'

async function main() {
  const queueName = 'rpc_server'

  const amqpConnection = new AmqpConnection()
  const connection = await amqpConnection.connect()
  if (!connection) throw new Error('Connection error')

  const rpcServer = new RpcServer({ queueName, connection })
  await rpcServer.run()
}

main()
