// Require the framework and instantiate it
const fastify = require('fastify')({
  logger: true
})
fastify.register(require('fastify-ws'))

const ReconnectingWebsocket = require('node-reconnect-ws');

const chatServicePort = process.env.CHAT_SERVICE_PORT || '3001';
const chatServiceHost = process.env.CHAT_SERVICE_HOST || 'localhost';

const clients = {};
let clientIdSequence = 0;
let backendConnection = null;
const msgQueueMax = 20;
const msgQueue = [];

const connectToBackend = () => {
  const reconnectingWs = new ReconnectingWebsocket({ url: `ws://${chatServiceHost}:${chatServicePort}` });
  reconnectingWs.on('error',() => fastify.log.warn('Lost connection to backend'))
  reconnectingWs.on('open',() => {
    while (msgQueue.length) {
      reconnectingWs.send(JSON.stringify(msgQueue.shift()));
    }
  })
  reconnectingWs.on('message', data => {
    const message = JSON.parse(data);
    const clientId = message.clientId;
    delete message.clientId
    if (message.broadcast) {
      broadcast(JSON.stringify(message))
    } else {
      clients[clientId].send(JSON.stringify(message))
    }
  });
  return reconnectingWs;
}

backendConnection = connectToBackend();

const sendToBackend = (msgObj) => {
  if (backendConnection && backendConnection.ws.readyState === 1) {
    backendConnection.send(JSON.stringify(msgObj))
  } else {
    if (msgQueue.length > msgQueueMax) {
      msgQueue.shift() //bye :(
    }
    msgQueue.push(msgObj)
  }
}


const broadcast = (data) => {
  fastify.ws.clients.forEach(function each(client) {
    client.send(data);
  });
}

const handleMessage = (raw, clientId) => {
  const msg = JSON.parse(raw);
  msg.clientId = clientId;
  sendToBackend(msg)
}

const start = async () => {
  try {
    await fastify.listen(3000)
    fastify.log.info(`server listening on ${fastify.server.address().port}`)
    fastify.ws
    .on('connection', socket => {
      fastify.log.info('Client connected.')
      const clientId = clientIdSequence++;
      clients[clientId] = socket
      socket.on('message', msg => handleMessage(msg, clientId)) 
      socket.on('close', () => {
        fastify.log.info('Client disconnected.');
        delete clients[clientId];
      });
    })
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

fastify.get('/status', async () => {
  return { connections: Object.keys(clients) }
})

start()