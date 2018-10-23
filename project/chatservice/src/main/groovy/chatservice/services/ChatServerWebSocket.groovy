package chatservice.services

import chatservice.domain.ChatMessage
import chatservice.subscribers.MongodbSubscriber
import com.mongodb.reactivestreams.client.MongoClient
import com.mongodb.reactivestreams.client.MongoCollection
import io.micronaut.context.annotation.Value
import io.micronaut.websocket.annotation.OnClose
import io.micronaut.websocket.annotation.OnMessage
import io.micronaut.websocket.annotation.OnOpen
import io.micronaut.websocket.annotation.ServerWebSocket
import org.reactivestreams.Publisher
import org.slf4j.Logger
import org.slf4j.LoggerFactory

import java.util.concurrent.TimeUnit

@ServerWebSocket("/chat/{sender}")
class ChatServerWebSocket {
    MongoClient mongoClient
    Logger log = LoggerFactory.getLogger(ChatServerWebSocket)

    MongoCollection<ChatMessage> chatmessageCollection

    ChatServerWebSocket(MongoClient mongoClient, @Value('${mongodb.dbname:chat}') String databaseName) {
        this.mongoClient = mongoClient
        chatmessageCollection = getCollection(databaseName)
    }

    @OnOpen
    void onSocketOpen(String sender) {
        log.info "Server socket opened for $sender"
    }

    @OnMessage
    void onSocketMessage(String sender, String message) {
        log.info "Message received: [$sender]: $message"
        subscribeAndAwait(chatmessageCollection.insertOne(new ChatMessage(sender: sender, message: message)))
    }

    @OnClose
    void onSocketClose(String sender) {
        log.info "Server socket closed for $sender"
    }

    private MongoCollection<ChatMessage> getCollection(String databaseName) {
        return mongoClient.getDatabase(databaseName).getCollection('chatmessage', ChatMessage)
    }

    private static <T> void subscribeAndAwait(final Publisher<T> publisher) throws Throwable {
        MongodbSubscriber<T> subscriber = new MongodbSubscriber<T>()
        publisher.subscribe(subscriber)
        subscriber.await(2000, TimeUnit.MILLISECONDS)
    }
}
