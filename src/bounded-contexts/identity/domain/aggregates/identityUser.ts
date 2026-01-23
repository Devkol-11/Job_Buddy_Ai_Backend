import { AggregateRoot } from '@src/shared/ddd/agggragateRoot.js';
import { RefreshToken } from '../entities/refreshToken.js';
import { ResetToken } from '../entities/resetToken.js';
import { randomUUID } from 'crypto';
import { IdentityStatus } from '../enums/domainEnums.js';
import { DomainEvents } from '../events/domainEvents.js';
import { DomainErrors } from '../errors/domainErrors.js';

interface IdentityUserProps {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        passwordHash: string;
        status: IdentityStatus;
        createdAt: Date;
        updatedAt: Date;
        refreshTokens: RefreshToken[];
        resetTokens: ResetToken[];
}

export class IdentityUser extends AggregateRoot<IdentityUserProps> {
        private constructor(readonly props: Omit<IdentityUserProps, 'id'>, readonly id: string) {
                super(props, id);
        }

        static create(
                props: Omit<
                        IdentityUserProps,
                        'id' | 'createdAt' | 'updatedAt' | 'status' | 'refreshTokens' | 'resetTokens'
                >
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
                                refreshTokens: [],
                                resetTokens: []
                        },
                        id
                );

                const event = new DomainEvents.UserRegisteredEvent({ userId: id, email: props.email });

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
                                refreshTokens: props.refreshTokens,
                                resetTokens: props.resetTokens
                        },
                        props.id
                );
        }

        public addRefreshToken(token: RefreshToken) {
                this.props.refreshTokens.push(token);
        }

        public addResetToken(token: ResetToken): void {
                // Security Rule: Only one reset token should be active at a time - so we invalidate all at first
                this.props.resetTokens.forEach((t) => t.invalidate());

                this.props.resetTokens.push(token);
                this.props.updatedAt = new Date();

                // Raise event so the Email Service knows to send the link
                const event = new DomainEvents.UserForgotPasswordEvent({
                        userId: this.id,
                        email: this.props.email,
                        token: token.props.value // The hex string for the URL
                });

                this.addDomainEvent(event);
        }

        /**
         * Validates the token and updates password in one atomic move.
         */
        public resetPassword(tokenValue: string, newPasswordHash: string): void {
                // 1. Find the token in the internal list
                const token = this.props.resetTokens.find((t) => t.props.value === tokenValue);

                // 2. Validate - Throw specific Domain Errors
                if (!token) {
                        throw new DomainErrors.InvalidResetTokenError(
                                'Reset token not found in user account.'
                        );
                }

                if (token.isExpired()) {
                        throw new DomainErrors.InvalidResetTokenError('Reset token has expired.');
                }

                if (!token.props.isValid) {
                        throw new DomainErrors.InvalidResetTokenError('Reset token has already been used.');
                }

                // 3. Apply State Changes
                this.props.passwordHash = newPasswordHash;
                this.props.updatedAt = new Date();

                // 4. Invalidate the token
                token.invalidate();

                // 5. Add Domain Event
                this.addDomainEvent(
                        new DomainEvents.PasswordUpdatedEvent({
                                userId: this.id,
                                email: this.props.email
                        })
                );
        }

        revokeToken(tokenValue: string): boolean {
                const token = this.props.refreshTokens.find((t) => t.props.value === tokenValue);
                if (!token) return false;

                token.revoke(); // Calls the revoke() method on the Token entity
                this.props.updatedAt = new Date();
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
