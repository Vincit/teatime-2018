package chatservice.subscribers

import org.reactivestreams.Subscriber
import org.reactivestreams.Subscription
import org.slf4j.Logger
import org.slf4j.LoggerFactory

import java.util.concurrent.CountDownLatch
import java.util.concurrent.TimeUnit

class MongodbSubscriber<T> implements Subscriber<T> {
    Logger log = LoggerFactory.getLogger(MongodbSubscriber)
    private final CountDownLatch latch
    private volatile Subscription subscription
    private volatile boolean completed

    MongodbSubscriber() {
        this.latch = new CountDownLatch(1)
    }

    @Override
    void onSubscribe(final Subscription s) {
        subscription = s
    }

    @Override
    void onNext(final T t) {
        log.info "Object written to DB"
    }

    @Override
    void onError(final Throwable t) {
        log.error "Error while writing to DB, $t"
        onComplete()
    }

    @Override
    void onComplete() {
        completed = true
        latch.countDown()
    }

    Subscription getSubscription() {
        return subscription
    }

    boolean isCompleted() {
        return completed
    }

    MongodbSubscriber<T> await() throws Throwable {
        return await(Long.MAX_VALUE, TimeUnit.MILLISECONDS)
    }

    MongodbSubscriber<T> await(final long timeout, final TimeUnit unit) throws Throwable {
        subscription.request(Integer.MAX_VALUE)
        if (!latch.await(timeout, unit)) {
            log.warn "MongoDB operation timed out"
        }
        return this
    }
}

