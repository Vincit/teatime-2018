# Chatservice

This is a simple webapp backend created with Micronaut (http://micronaut.io/). It provides services for writing data into a MongoDB in a replica set configuration via a websocket connection, and monitoring of the collection of messages. The monitoring component pushes new messages arriving into the database to all websockets in the system.

## Structure

This application conforms to Gradle and Micronaut file structure. All the source code is in the `src/main/groovy/`-directory, and resources in the `src/main/resources/`-directory. The main code to look at are the ones found in the `services`-directory. The `ChatServerWebSocket`-class handles receiving the data by the means of Websocket connections, and writes them into the database. The `ChatTableWatcher`-class is instantiated at startup and follows the MongoDB collection for messages, and facilitates sending data to all the connected sockets.

## Environment variables

See `application.yaml`. The following need to be overridden if run via environment variables:

- `MONGODB_URI` = Full connection URI to MongoDB replicaset (3.6 or later)
- `MONGODB_SSL` = Whether the connection should be SSL-enabled (true) or not (false)
- `MONGODB_DBNAME` = The name of the database that will be used in MongoDB

## In this example

See the `k8s/`-directory for specs on how the application is configured and monitored by Kubernetes. We're doing overwriting of configuration parameters by including the secrets from Kubernetes as a mounted file, a link to which is then passed on to Micronaut via an environment variable.
