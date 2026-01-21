import { Entity } from './entity.js';
import { IDomainEvents } from './domainEvents.js';

export class AggregateRoot<T> extends Entity<T> {
        private domainEvents: IDomainEvents[] = [];

        protected addDomainEvent(event: IDomainEvents) {
                this.domainEvents.push(event);
        }

        protected clearDomainEvents() {
                this.domainEvents = [];
        }
}
