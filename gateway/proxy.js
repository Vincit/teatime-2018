// Require the framework and instantiate it
const fastify = require('fastify')({
  logger: true
})
fastify.register(require('fastify-ws'))

const nodeReconnectWs = require('node-reconnect-ws');

const clients = {};

let clientId = 0;

const broadcast = (data) => {
  fastify.ws.clients.forEach(function each(client) {
    client.send(data);
  });
}

const chatServicePort = process.env.CHAT_SERVICE_PORT || '3000';
const chatServiceHost = process.env.CHAT_SERVICE_HOST || 'localhost';

const ws = new nodeReconnectWs({ url: `ws://${chatServiceHost}:${chatServicePort}` });

ws.on('message', data => {
  const message = JSON.parse(data);
  const clientId = message.clientId;
  delete message.clientId
  if (message.broadcast) {
    broadcast(JSON.stringify(message))
  } else {
    clients[clientId].send(JSON.stringify(message))
  }
});

const handleMessage = (raw, clientId) => {
  const msg = JSON.parse(raw);
  msg.clientId = clientId;
  ws.send(JSON.stringify(msg))
}

// Run the server!
const start = async () => {
  try {
    await fastify.listen(3000)
    fastify.log.info(`server listening on ${fastify.server.address().port}`)
    fastify.ws
    .on('connection', socket => {
      fastify.log.info('Client connected.')
      const cid = clientId++;
      clients[cid] = socket
      socket.on('message', msg => handleMessage(msg, cid)) 
      socket.on('close', () => {
        fastify.log.info('Client disconnected.');
        delete clients.cid;
      });
    })
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
start()