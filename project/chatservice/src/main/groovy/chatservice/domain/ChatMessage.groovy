package chatservice.domain

import org.bson.types.ObjectId

class ChatMessage {
    ObjectId id
    String sender
    String message
    Date dateTime = new Date()

    String toString() {
        return "[$sender]: $message"
    }
}
