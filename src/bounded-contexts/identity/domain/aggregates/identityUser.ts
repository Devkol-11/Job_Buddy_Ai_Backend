import { AggregateRoot } from '@src/shared/ddd/agggragateRoot.js';
import { Token } from '../entities/token.js';
import { randomUUID } from 'crypto';
import { IdentityStatus } from '../enums/domainEnums.js';
import { tokenAddedEvent } from '../events/tokenAddedEvent.js';

interface IdentityUserProps {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        passwordHash: string;
        status: IdentityStatus;
        createdAt: Date;
        updatedAt: Date;
        tokens: Token[];
}

export class IdentityUser extends AggregateRoot<IdentityUserProps> {
        private constructor(props: Omit<IdentityUserProps, 'id'>, id: string) {
                super(props, id);
        }

        static create(props: Omit<IdentityUserProps, 'id' | 'createdAt' | 'updatedAt'>) {
                const id = randomUUID();
                return new IdentityUser(
                        {
                                email: props.email,
                                firstName: props.firstName,
                                lastName: props.lastName,
                                passwordHash: props.passwordHash,
                                status: IdentityStatus.ACTIVE,
                                createdAt: new Date(),
                                updatedAt: new Date(),
                                tokens: []
                        },
                        id
                );
        }

        updatePassword(passwordHash: string) {
                this.props.passwordHash = passwordHash;
                this.props.updatedAt = new Date();
        }

        addToken(token: Token) {
                this.props.tokens.push(token);
                const event = new tokenAddedEvent({ userId: this.id, token: token.props.value });
                this.addDomainEvent(event);
        }

        getProps() {
                return { ...this.props };
        }
}
