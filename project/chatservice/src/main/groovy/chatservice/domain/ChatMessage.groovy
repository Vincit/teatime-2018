package chatservice.domain

import org.bson.types.ObjectId

import java.time.LocalDateTime

class ChatMessage {
    ObjectId id
    String sender
    String message
    LocalDateTime dateTime = LocalDateTime.now()

    String toString() {
        return "[$sender]: $message"
    }
}
