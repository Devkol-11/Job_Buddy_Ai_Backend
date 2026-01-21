import { AggregateRoot } from '@src/shared/ddd/agggragateRoot.js';
import { randomUUID } from 'node:crypto';

interface TokenStoreProps {
        id: string;
}

export class TokenStoreAggregate extends AggregateRoot<TokenStoreProps> {
        private constructor(props: Omit<TokenStoreProps, 'id'>, id: string) {
                super(props, id);
        }

        static create(props: Omit<TokenStoreProps, 'id'>) {
                const id = randomUUID();
                return new TokenStoreAggregate({}, id);
        }
}
