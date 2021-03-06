// Require the framework and instantiate it
const fastify = require('fastify')({
  logger: true
})
fastify.register(require('fastify-ws'))

const broadcast = (data) => {
  const stringified = JSON.stringify(data);
  fastify.ws.clients.forEach(function each(client) {
    client.send(stringified);
  });
}

const handleMessage = (msg) => {
  const payload = JSON.parse(msg);
  if (payload.event === 'new-message') {
    payload.content = { message: payload.message, sender: payload.user, dateTime: new Date().toISOString() };
    broadcast(payload)
  }
}

['SIGINT', 'SIGTERM'].forEach(signal => {
  process.once(signal, () => {
    fastify.close();
  })
})

// Run the server!
const start = async () => {
  try {
    await fastify.listen(3000)
    fastify.log.info(`server listening on ${fastify.server.address().port}`)
    fastify.ws
    .on('connection', socket => {
      fastify.log.info('Client connected.')
      socket.on('message', msg => handleMessage(msg, socket))
      socket.on('close', () => fastify.log.info('Client disconnected.'))
    })
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
start()
