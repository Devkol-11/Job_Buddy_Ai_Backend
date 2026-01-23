import { Entity } from '@src/shared/ddd/entity.js';
import { randomUUID } from 'node:crypto';

interface ResetTokenProps {
        id: string;
        identityUserId: string;
        value: string;
        expiresAt: Date;
        isExpired: boolean;
        isValid: boolean;
        createdAt: Date;
        updatedAt: Date;
}

export class ResetToken extends Entity<ResetTokenProps> {
        private constructor(readonly props: Omit<ResetTokenProps, 'id'>, readonly id: string) {
                super(props, id);
        }

        static create(
                props: Omit<ResetTokenProps, 'id' | 'isExpired' | 'isValid' | 'createdAt' | 'updatedAt'>
        ): ResetToken {
                const id = randomUUID();
                return new ResetToken(
                        {
                                identityUserId: props.identityUserId,
                                value: props.value,
                                expiresAt: props.expiresAt,
                                isExpired: false,
                                isValid: true,
                                createdAt: new Date(),
                                updatedAt: new Date()
                        },
                        id
                );
        }

        static rehydrate(props: ResetTokenProps): ResetToken {
                return new ResetToken(
                        {
                                identityUserId: props.identityUserId,
                                value: props.value,
                                expiresAt: props.expiresAt,
                                isExpired: props.isExpired,
                                isValid: props.isValid,
                                createdAt: props.createdAt,
                                updatedAt: props.updatedAt
                        },
                        props.id
                );
        }

        /**
         * Business Logic: Checks if the system clock has passed the expiry date
         */
        public isExpired(): boolean {
                return new Date() > this.props.expiresAt;
        }

        /**
         * Business Logic: Comprehensive check for the Aggregate
         */
        public isActive(): boolean {
                // A token is active ONLY if it hasn't been manually invalidated,
                // hasn't been marked expired, and the clock hasn't run out.
                return this.props.isValid && !this.props.isExpired && !this.isExpired();
        }

        /**
         * State Change: Marks the token as dead.
         */
        public invalidate(): void {
                this.props.isValid = false;
                this.props.isExpired = true;
                this.props.updatedAt = new Date();
        }

        // --- Getters for easier Aggregate access ---

        get value(): string {
                return this.props.value;
        }

        get isValid(): boolean {
                return this.props.isValid;
        }
}
