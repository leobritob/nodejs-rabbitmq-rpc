import { AmqpConnection } from './connection'
import { RpcClient } from './rpc_client'
import { RpcServer } from './rpc_server'

async function main() {
  const amqpConnection = new AmqpConnection()
  const connection = await amqpConnection.connect()
  if (!connection) throw new Error('Connection error')

  const queueName = process.env.QUEUE_NAME || 'rpc_server'

  const rpcServer = new RpcServer({ queueName, connection })
  await rpcServer.run()

  const rpcClient = new RpcClient({ queueName, connection })
  await rpcClient.run(process.argv[2])
}

main()
