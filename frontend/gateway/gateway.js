// Require the framework and instantiate it
const fastify = require('fastify')({
  logger: true
});
fastify.register(require('fastify-ws'));

const ReconnectingWebsocket = require('node-reconnect-ws');

const chatServicePort = process.env.CHAT_SERVICE_PORT || '8080';
const chatServiceHost = process.env.CHAT_SERVICE_HOST || 'chatservice';

let clientIdSequence = 0;
const chatServiceConnections = {};
const msgBufferMax = 20;
const msgBuffer = {};


const handleMessageFromChatService = (socket) => (data) => {
  try {
    const dataObj = JSON.parse(data);
    delete dataObj.id;
    socket.send(JSON.stringify({event: 'new-message', content: dataObj}));
  } catch (err) {
    //connection problem between client <-> server
  }
}

const connectToChatService = (clientId, user, socket) => {
  const reconnectingWs = new ReconnectingWebsocket({ url: `ws://${chatServiceHost}:${chatServicePort}/chat/${user}` });
  reconnectingWs.on('error',() => fastify.log.warn('Lost connection to backend'))
  reconnectingWs.on('open',() => {
    while (msgBuffer[clientId].length) {
      reconnectingWs.send(msgBuffer[clientId].shift());
    }
  })
  reconnectingWs.on('message', handleMessageFromChatService(socket));
  return reconnectingWs;
}

const sendToChatService = (msgObj, clientId, socket) => {
  if (!chatServiceConnections[clientId]) {
    chatServiceConnections[clientId] = connectToChatService(clientId, msgObj.user, socket);
  }
  if (chatServiceConnections[clientId].ws.readyState === 1) { // ws connection open
    chatServiceConnections[clientId].send(msgObj.message);
  } else {
    if (!msgBuffer[clientId]) {
      msgBuffer[clientId] = [];
    }
    if (msgBuffer[clientId] && msgBuffer[clientId].length > msgBufferMax) {
      msgBuffer[clientId].shift();
    }
    msgBuffer[clientId].push(msgObj.message);
  }
}

['SIGINT', 'SIGTERM'].forEach(signal => {
  process.once(signal, () => {
    fastify.close();
  })
})

const handleMessage = (clientId, socket) => (rawMsg) => {
  try {
    const msg = JSON.parse(rawMsg);;
    fastify.log.info(`Got msg ${rawMsg}`);
    if (msg.event === 'new-message') {
      sendToChatService(msg, clientId, socket);
    }
  } catch (e) {
    //parse error, do nothing
  }
}

const start = async () => {
  try {
    await fastify.listen(3000);
    fastify.log.info(`server listening on ${fastify.server.address().port}`);
    fastify.ws
    .on('connection', socket => {
      fastify.log.info('Client connected.');
      const clientId = clientIdSequence++;
      socket.on('message', handleMessage(clientId, socket)) ;
      socket.on('close', () => {
        fastify.log.info('Client disconnected.');
        if (chatServiceConnections[clientId]) {
          chatServiceConnections[clientId].close();
          delete chatServiceConnections[clientId];
        }
        if (msgBuffer[clientId]) {
          delete msgBuffer[clientId];
        }
      });
    })
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

fastify.get('/status', async () => {
  return { connections:  Object.keys(chatServiceConnections) };
})

start();