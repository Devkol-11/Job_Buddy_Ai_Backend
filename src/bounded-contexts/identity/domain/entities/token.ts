import { Entity } from '@src/shared/ddd/entity.js';
import { randomUUID } from 'node:crypto';

interface TokenProps {
        id: string;
        value: string;
        isRevoked: boolean;
        expiresAt: Date;
}

export class Token extends Entity<TokenProps> {
        private constructor(readonly props: Omit<TokenProps, 'id'>, readonly id: string) {
                super(props, id);
        }

        static create(props: Omit<TokenProps, 'id' | 'isRevoked'>) {
                const id = randomUUID();
                return new Token(
                        {
                                value: props.value,
                                expiresAt: new Date(props.expiresAt),
                                isRevoked: false
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
}
