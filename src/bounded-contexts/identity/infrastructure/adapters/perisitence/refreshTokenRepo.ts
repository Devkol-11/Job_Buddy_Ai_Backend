import { RefreshToken } from '@src/bounded-contexts/identity/domain/model/aggregates/refreshToken.js';
import { RefreshTokenRepositoryPort } from '../../../application/ports/refreshRepositoryTokenPort.js';
import { dbClient } from '@src/config/prisma/prisma.js';
import { type Prisma } from 'generated/prisma/client.js';

export class RefreshTokenRepository implements RefreshTokenRepositoryPort {
        async findByValue(value: string): Promise<RefreshToken | null> {
                const token = await dbClient.refreshToken.findUnique({ where: { value } });
                if (!token) return null;
                const toDomain = RefreshToken.rehydrate({ token });
                return toDomain;
        }

        async save(token: RefreshToken, trx?: Prisma.TransactionClient): Promise<void> {
                const toPersistence = token.getProps();

                const client = trx ? trx : dbClient;

                await client.refreshToken.upsert({
                        where: {
                                id: toPersistence.id
                        },
                        update: {
                                id: toPersistence.id,
                                identityUserId: toPersistence.identityUserId,
                                value: toPersistence.value,
                                isRevoked: toPersistence.isRevoked,
                                expiresAt: toPersistence.expiresAt,
                                createdAt: toPersistence.createdAt,
                                updatedAt: toPersistence.updatedAt
                        },
                        create: {
                                id: toPersistence.id,
                                identityUserId: toPersistence.identityUserId,
                                value: toPersistence.value,
                                isRevoked: toPersistence.isRevoked,
                                expiresAt: toPersistence.expiresAt,
                                createdAt: toPersistence.createdAt,
                                updatedAt: toPersistence.updatedAt
                        }
                });
        }

        async deleteAllForUser(userId: string, trx?: Prisma.TransactionClient): Promise<void> {
                const client = trx ? trx : dbClient
                await client.refreshToken.deleteMany({ where: { identityUserId: userId } })
                return
        }

        async delete(token: RefreshToken, trx?: Prisma.TransactionClient): Promise<void> {
                const client = trx ? trx : dbClient
                const tokenValue = token.getProps().value
                await client.refreshToken.delete({ where: { value: tokenValue } })
                return
        }
}
