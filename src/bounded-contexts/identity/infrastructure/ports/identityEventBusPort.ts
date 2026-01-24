import { IDomainEvents } from '@src/shared/ddd/domainEvents.js';

export interface IdentityEventBusPort {
        publish(event: IDomainEvents): Promise<void>;
}
