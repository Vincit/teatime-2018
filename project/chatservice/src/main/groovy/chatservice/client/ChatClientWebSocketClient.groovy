package chatservice.client

import io.micronaut.websocket.WebSocketSession
import io.micronaut.websocket.annotation.ClientWebSocket
import io.micronaut.websocket.annotation.OnMessage
import io.micronaut.websocket.annotation.OnOpen
import org.slf4j.Logger
import org.slf4j.LoggerFactory

import java.util.concurrent.ConcurrentLinkedQueue

@ClientWebSocket("/chat/{sender}")
abstract class ChatClientWebSocketClient implements AutoCloseable {

    private WebSocketSession session
    Logger log = LoggerFactory.getLogger(ChatClientWebSocketClient)
    private String sender
    private Collection<String> replies = new ConcurrentLinkedQueue<>()

    abstract void send(String message)

    @OnOpen
    void onOpen(String sender, WebSocketSession session) {
        this.sender = sender
        this.session = session
    }

    @OnMessage
    void onMessage(String message) {
        log.info "Client: A message was received ! $message"
    }
}