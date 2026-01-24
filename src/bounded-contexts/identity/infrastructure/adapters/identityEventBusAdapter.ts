import { IdentityEventBusPort } from '../ports/identityEventBusPort.js';
import { redisClient } from '@src/config/redis/client/redis.js';
import { IDomainEvents } from '@src/shared/ddd/domainEvents.js';
import { Queue } from 'bullmq';

export class BullMQ_Identity_EventBus implements IdentityEventBusPort {
        private readonly queue: Queue;
        private readonly queueName: string = 'identity_events';

        constructor() {
                this.queue = new Queue(this.queueName, { connection: redisClient });
        }

        async publish(event: IDomainEvents): Promise<void> {
                await this.queue.add(event.eventName, event, {
                        attempts: 5,
                        backoff: {
                                type: 'exponential',
                                delay: 1000
                        },
                        removeOnComplete: true
                });
        }
}
