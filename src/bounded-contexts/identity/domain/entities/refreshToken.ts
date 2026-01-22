import { Entity } from '@src/shared/ddd/entity.js';
import { randomUUID } from 'node:crypto';

interface refreshTokenProps {
        id: string;
        value: string;
        identityUserId: string;
        expiresAt: Date;
        isRevoked: boolean;
        createdAt: Date;
        updatedAt: Date;
}

export class RefreshToken extends Entity<refreshTokenProps> {
        private constructor(readonly props: Omit<refreshTokenProps, 'id'>, readonly id: string) {
                super(props, id);
        }

        static create(props: Omit<refreshTokenProps, 'id' | 'isRevoked' | 'createdAt' | 'updatedAt'>) {
                const id = randomUUID();
                return new RefreshToken(
                        {
                                value: props.value,
                                identityUserId: props.identityUserId,
                                expiresAt: new Date(props.expiresAt),
                                isRevoked: false,
                                createdAt: new Date(),
                                updatedAt: new Date()
                        },
                        id
                );
        }

        isRevoked(): boolean {
                if (this.props.isRevoked == true) {
                        return true;
                }
                return false;
        }

        revoke() {
                this.props.isRevoked = true;
        }

        getValue() {
                return this.props.value;
        }
}
