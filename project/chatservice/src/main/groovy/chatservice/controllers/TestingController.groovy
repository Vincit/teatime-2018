package chatservice.controllers

import chatservice.client.ChatClientWebSocketClient
import io.micronaut.http.annotation.Controller
import io.micronaut.http.annotation.Get
import io.micronaut.http.annotation.QueryValue
import io.micronaut.http.client.annotation.Client
import io.micronaut.websocket.RxWebSocketClient
import org.slf4j.Logger
import org.slf4j.LoggerFactory

import javax.inject.Inject

@Controller("/chattest")
class TestingController {

    Logger log = LoggerFactory.getLogger(TestingController)

    @Inject
    @Client("http://localhost:8080")
    RxWebSocketClient webSocketClient

    @Get
    String index() {
        "This is the chat testing controller"
    }

    @Get("/{sender}")
    String sendMessage(String sender, @QueryValue String message) {
        log.info "Handling demo message sending"
        ChatClientWebSocketClient client = webSocketClient.connect(ChatClientWebSocketClient, "/chat/$sender/".toString()).blockingFirst()
        client.send(message)
        "Sent."
    }
}
