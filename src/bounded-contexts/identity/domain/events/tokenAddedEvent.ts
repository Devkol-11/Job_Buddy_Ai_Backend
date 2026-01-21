import { IDomainEvents } from '@src/shared/ddd/domainEvents.js';

export class tokenAddedEvent implements IDomainEvents {
        readonly eventName: string;
        readonly data: object;
        constructor(data: { userId: string; token: string }) {
                this.eventName = 'Token_Added_Event';
                this.data = data;
        }
}
