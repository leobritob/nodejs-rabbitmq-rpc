import { AmqpConnection } from './connection'
import { RpcClient } from './rpc_client'

async function main() {
  const amqpConnection = new AmqpConnection()
  const connection = await amqpConnection.connect()
  if (!connection) throw new Error('Connection error')

  const queueName = 'rpc_server'

  const rpcClient = new RpcClient({ queueName, connection })
  await rpcClient.run(process.argv[2])
}

main()
