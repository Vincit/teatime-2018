package chatservice.services

import chatservice.domain.ChatMessage
import chatservice.subscribers.CollectionSubscriber
import com.mongodb.client.model.changestream.ChangeStreamDocument
import com.mongodb.client.model.changestream.FullDocument
import com.mongodb.reactivestreams.client.MongoClient
import com.mongodb.reactivestreams.client.MongoCollection
import io.micronaut.context.annotation.Context
import io.micronaut.context.annotation.Requires
import io.micronaut.context.annotation.Value
import io.micronaut.websocket.WebSocketBroadcaster
import org.slf4j.Logger
import org.slf4j.LoggerFactory

import java.util.concurrent.TimeUnit

@Context
@Requires(beans = MongoClient)
@Requires(beans = WebSocketBroadcaster)
class ChatTableWatcher {

    Logger log = LoggerFactory.getLogger(ChatTableWatcher)

    MongoClient mongoClient
    String databaseName
    WebSocketBroadcaster webSocketBroadcaster
    MongoCollection<ChatMessage> chatmessageCollection
    def publisher
    def subscriber

    ChatTableWatcher(MongoClient mongoClient, WebSocketBroadcaster webSocketBroadcaster,
                     @Value('${mongodb.dbname:chat}') String databaseName) {
        log.info "ChatTableWatcher init starting."

        this.mongoClient = mongoClient
        this.webSocketBroadcaster = webSocketBroadcaster
        this.databaseName = databaseName

        chatmessageCollection = mongoClient.getDatabase(databaseName).getCollection('chatmessage', ChatMessage)

        publisher = chatmessageCollection.watch(ChatMessage).fullDocument(FullDocument.UPDATE_LOOKUP).batchSize(1)

        subscriber = new CollectionSubscriber<ChangeStreamDocument<ChatMessage>>(webSocketBroadcaster)

        publisher.subscribe(subscriber)
        subscriber.await(1000, TimeUnit.MILLISECONDS)

        log.info "ChatTableWatcher init complete."
    }
}
