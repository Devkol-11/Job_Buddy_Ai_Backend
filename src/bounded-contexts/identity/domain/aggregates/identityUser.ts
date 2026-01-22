import { AggregateRoot } from '@src/shared/ddd/agggragateRoot.js';
import { RefreshToken } from '../entities/refreshToken.js';
import { randomUUID } from 'crypto';
import { IdentityStatus } from '../enums/domainEnums.js';
import { PasswordUpdatedEvent, TokenAddedEvent, UserRegisteredEvent } from '../events/domainEvents.js';

interface IdentityUserProps {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        passwordHash: string;
        status: IdentityStatus;
        createdAt: Date;
        updatedAt: Date;
        tokens: RefreshToken[];
}

export class IdentityUser extends AggregateRoot<IdentityUserProps> {
        private constructor(readonly props: Omit<IdentityUserProps, 'id'>, readonly id: string) {
                super(props, id);
        }

        static create(
                props: Omit<IdentityUserProps, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'tokens'>
        ): IdentityUser {
                const id = randomUUID();
                const user = new IdentityUser(
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

                const event = new UserRegisteredEvent({ userId: id, email: props.email });

                user.addDomainEvent(event);

                return user;
        }

        static rehydrate(props: IdentityUserProps): IdentityUser {
                return new IdentityUser(
                        {
                                email: props.email,
                                firstName: props.firstName,
                                lastName: props.lastName,
                                passwordHash: props.passwordHash,
                                status: props.status,
                                createdAt: props.createdAt,
                                updatedAt: props.updatedAt,
                                tokens: props.tokens
                        },
                        props.id
                );
        }

        updatePassword(passwordHash: string) {
                this.props.passwordHash = passwordHash;
                this.props.updatedAt = new Date();
                const event = new PasswordUpdatedEvent({ userId: this.id, email: this.email });
                this.addDomainEvent(event);
        }

        addToken(token: RefreshToken) {
                this.props.tokens.push(token);
                const event = new TokenAddedEvent({ userId: this.id, token: token.props.value });
                this.addDomainEvent(event);
        }

        revokeToken(tokenValue: string): boolean {
                const token = this.props.tokens.find((t) => t.props.value === tokenValue);
                if (!token) return false;

                token.revoke(); // Calls the revoke() method on the Token entity
                this.props.updatedAt = new Date();

                // Optional: addDomainEvent(new TokenRevokedEvent(...))
                return true;
        }

        getProps() {
                return { id: this.id, ...this.props };
        }

        getClaims() {
                return {
                        id: this.id,
                        email: this.props.email
                };
        }

        get userId() {
                return this.id;
        }

        get email() {
                return this.props.email;
        }

        get firstName() {
                return this.props.firstName;
        }

        get lastName() {
                return this.props.lastName;
        }

        get status() {
                return this.props.status;
        }
}
