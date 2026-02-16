import { IDomainEvents } from '@src/shared/base/eventsBase.js';

export namespace IdentityEvents {
        export class ResetTokenAddedEvent implements IDomainEvents {
                readonly eventName: string;
                readonly occurredAt: Date;
                readonly data: Record<string, unknown>;

                constructor(data: { userId: string; token: string; email: string }) {
                        this.eventName = 'TOKEN_ADDED';
                        this.occurredAt = new Date();
                        this.data = data;
                }
        }

        export class UserRegisteredEvent implements IDomainEvents {
                readonly eventName: string;
                readonly occurredAt: Date;
                readonly data: Record<string, unknown>;

                constructor(data: { userId: string; email: string }) {
                        this.eventName = 'USER_REGISTERED';
                        this.occurredAt = new Date();
                        this.data = data;
                }
        }

        export class PasswordUpdatedEvent implements IDomainEvents {
                readonly eventName: string;
                readonly occurredAt: Date;
                readonly data: Record<string, unknown>;

                constructor(data: { userId: string; email: string }) {
                        this.eventName = 'PASSWORD_RESET';
                        this.occurredAt = new Date();
                        this.data = data;
                }
        }

        export class UserForgotPasswordEvent implements IDomainEvents {
                readonly eventName: string;
                readonly occurredAt: Date;
                readonly data: Record<string, unknown>;
                constructor(data: { userId: string; email: string; token: string }) {
                        this.eventName = 'USER_FORGOT_PASSWORD';
                        this.occurredAt = new Date();
                        this.data = data;
                }
        }
}
