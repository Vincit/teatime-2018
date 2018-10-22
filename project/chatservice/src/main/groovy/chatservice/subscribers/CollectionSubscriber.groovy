package chatservice.subscribers

import chatservice.domain.ChatMessage
import com.mongodb.client.model.changestream.ChangeStreamDocument
import io.micronaut.websocket.WebSocketBroadcaster
import org.reactivestreams.Subscriber
import org.reactivestreams.Subscription
import org.slf4j.Logger
import org.slf4j.LoggerFactory

import java.util.concurrent.CountDownLatch
import java.util.concurrent.TimeUnit

class CollectionSubscriber<T> implements Subscriber<T> {
    Logger log = LoggerFactory.getLogger(CollectionSubscriber)
    private final CountDownLatch latch
    private volatile Subscription subscription
    private volatile boolean completed
    private final WebSocketBroadcaster webSocketBroadcaster

    CollectionSubscriber(WebSocketBroadcaster webSocketBroadcaster) {
        this.latch = new CountDownLatch(1)
        this.webSocketBroadcaster = webSocketBroadcaster
    }

    @Override
    void onSubscribe(final Subscription s) {
        log.info "Collection: Subscribed ${s.dump()}"
        subscription = s
    }

    @Override
    void onNext(final T t) {
        def viesti = (ChangeStreamDocument<ChatMessage>) t
        log.info "Collection: Broadcasting! $webSocketBroadcaster ${viesti.fullDocument.dump()}"
        webSocketBroadcaster.broadcastSync(viesti.fullDocument)
        log.info "Collection: Broadcast complete."
    }

    @Override
    void onError(final Throwable t) {
        log.error "Collection: Error", t
        onComplete()
    }

    @Override
    void onComplete() {
        log.info "Collection: Complete!"
        latch.countDown()
    }

    Subscription getSubscription() {
        subscription
    }

    CollectionSubscriber<T> await() throws Throwable {
        return await(Long.MAX_VALUE, TimeUnit.MILLISECONDS)
    }

    CollectionSubscriber<T> await(final long timeout, final TimeUnit unit) throws Throwable {
        subscription.request(Integer.MAX_VALUE)
        if (!latch.await(timeout, unit)) {
            log.warn "Collection: Publisher onComplete timed out"
        }
        return this
    }
}
