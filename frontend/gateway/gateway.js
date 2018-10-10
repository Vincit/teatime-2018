// Require the framework and instantiate it
const fastify = require('fastify')({
  logger: true
})
fastify.register(require('fastify-ws'))

const ReconnectingWebsocket = require('node-reconnect-ws');

const chatServicePort = process.env.CHAT_SERVICE_PORT || '8080';
const chatServiceHost = process.env.CHAT_SERVICE_HOST || 'chatservice';

let clientIdSequence = 0;
const backendConnection = {};
const msgQueueMax = 20;
const msgQueue = {};


const handleMessageFromBackend = (socket) => (data) => {
  try {
    socket.send(data);
  } catch (err) {
    //connection problem between client <-> server
  }
}

const connectToBackend = (clientId, socket) => {
  const reconnectingWs = new ReconnectingWebsocket({ url: `ws://${chatServiceHost}:${chatServicePort}/chat/${clientId}` });
  reconnectingWs.on('error',() => fastify.log.warn('Lost connection to backend'))
  reconnectingWs.on('open',() => {
    while (msgQueue[clientId].length) {
      reconnectingWs.send(JSON.stringify(msgQueue[clientId].shift()));
    }
  })
  reconnectingWs.on('message', handleMessageFromBackend(socket));
  return reconnectingWs;
}

const sendToBackend = (msgObj, clientId, socket) => {
  if (!backendConnection[clientId]) {
    backendConnection[clientId] = connectToBackend(clientId, socket)
  }
  if (backendConnection[clientId].ws.readyState === 1) {
    backendConnection[clientId].send(JSON.stringify(msgObj))
  } else {
    if (!msgQueue[clientId]) {
      msgQueue[clientId] = [];
    }
    if (msgQueue[clientId] && msgQueue[clientId].length > msgQueueMax) {
      msgQueue[clientId].shift() //bye :(
    }
    msgQueue[clientId].push(msgObj)
  }
}

['SIGINT', 'SIGTERM'].forEach(signal => {
  process.once(signal, () => {
    fastify.close();
  })
})

const handleMessage = (clientId, socket) => (rawMsg) => {
  try {
    const msg = JSON.parse(rawMsg);
    sendToBackend(msg, clientId, socket)
  } catch (e) {
    //parse error, do nothing
  }
}

const start = async () => {
  try {
    await fastify.listen(3000)
    fastify.log.info(`server listening on ${fastify.server.address().port}`)
    fastify.ws
    .on('connection', socket => {
      fastify.log.info('Client connected.')
      const clientId = clientIdSequence++;
      socket.on('message', handleMessage(clientId, socket)) 
      socket.on('close', () => {
        fastify.log.info('Client disconnected.');
        if (backendConnection[clientId]) {
          backendConnection[clientId].close();
          delete backendConnection[clientId];
        }
        if (msgQueue[clientId]) {
          delete msgQueue[clientId]
        }
      });
    })
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

fastify.get('/status', async () => {
  return { connections:  Object.keys(backendConnection) };
})

start()