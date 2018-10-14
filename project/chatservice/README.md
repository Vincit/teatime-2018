# Chatservice

Micronaut websocket proto with reactive monitoring of MongoDB collection.

## Structure

This is a websocket-based server, that writes incoming data into the database, and monitors the database for changes and transmits those to all clients.

## Environment variables

See `application.yaml`. The following need to be overridden:

- MONGODB_URI = Full connection URI to MongoDB replicaset (3.6 or later)
- MONGODB_SSL = Whether the connection should be SSL-enabled (true) or not (false)
- MONGODB_DBNAME = The name of the database that will be used in MongoDB
