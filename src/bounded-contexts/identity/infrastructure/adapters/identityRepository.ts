import { dbClient } from '@src/config/prisma/prisma.js';
import { IdentityRepositoryPort } from '../ports/IdentityRepositoryPort.js';
import { TransactionClient } from 'generated/prisma/internal/prismaNamespace.js';

import { IdentityUser } from '../../domain/aggregates/identityUser.js';

export class IdentityRepository implements IdentityRepositoryPort {
        create(entity: IdentityUser, trx?: TransactionClient): Promise<void> {
                const client = trx ? trx : dbClient;
                const toDomain = IdentityUser.
        }
}
