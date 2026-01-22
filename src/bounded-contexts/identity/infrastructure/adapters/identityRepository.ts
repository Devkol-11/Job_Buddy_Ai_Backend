import { Prisma } from 'generated/prisma/client.js';
import { dbClient } from '@src/config/prisma/prisma.js';
import { TransactionClient } from 'generated/prisma/internal/prismaNamespace.js';

import { IdentityUser } from '../../domain/aggregates/identityUser.js';
import { RefreshToken } from '../../domain/entities/refreshToken.js';
import { IdentityRepositoryPort } from '../ports/IdentityRepositoryPort.js';
import { DomainErrors } from '../../domain/errors/domainErrors.js';

export class IdentityRepository implements IdentityRepositoryPort {
        /**
         * Maps Domain Token entities to Prisma Input format
         */
        private mapTokensToPrisma(tokens: RefreshToken[]) {
                return tokens.map((token) => ({
                        id: token.id,
                        value: token.props.value,
                        expiresAt: token.props.expiresAt,
                        revoked: token.props.isRevoked,
                        createdAt: token.props.createdAt,
                        updatedAt: token.props.updatedAt
                }));
        }

        /**
         * Handles Infrastructure/I/O errors and translates them to Domain Errors
         */
        private handleError(err: any, context: string): never {
                const networkErrorCodes = ['ECONNREFUSED', 'ETIMEDOUT', 'ECONNRESET', 'ECONNTIMEOUT'];

                if (networkErrorCodes.includes(err?.code)) {
                        throw new DomainErrors.UserRegistrationError(
                                'Database connection timeout. Please try again.'
                        );
                }

                if (err instanceof Prisma.PrismaClientKnownRequestError) {
                        if (err.code === 'P2002') {
                                throw new DomainErrors.UserRegistrationError(
                                        'A user with this unique identifier already exists.'
                                );
                        }
                }

                console.error(`[IdentityRepository.${context}]`, err);
                throw new DomainErrors.UserRegistrationError(
                        'An unexpected error occurred during database operation.'
                );
        }

        async create(entity: IdentityUser, trx?: TransactionClient): Promise<void> {
                const client = trx ? trx : dbClient;
                const { tokens, ...userData } = entity.getProps();

                try {
                        await client.identityUser.create({
                                data: {
                                        ...userData,
                                        tokens: {
                                                create: this.mapTokensToPrisma(tokens)
                                        }
                                }
                        });
                } catch (err) {
                        this.handleError(err, 'create');
                }
        }

        async save(entity: IdentityUser, trx?: TransactionClient): Promise<IdentityUser> {
                const client = trx ? trx : dbClient;
                const { tokens, id, ...userData } = entity.getProps();

                try {
                        await client.identityUser.upsert({
                                where: { id: id },
                                update: {
                                        ...userData,
                                        tokens: {
                                                deleteMany: {}, // Replace strategy for Aggregate sync
                                                create: this.mapTokensToPrisma(tokens)
                                        }
                                },
                                create: {
                                        id,
                                        ...userData,
                                        tokens: {
                                                create: this.mapTokensToPrisma(tokens)
                                        }
                                }
                        });
                        return entity;
                } catch (err) {
                        this.handleError(err, 'save');
                }
        }

        async existsByEmail(email: string): Promise<boolean> {
                const count = await dbClient.identityUser.count({
                        where: { email }
                });
                return count > 0;
        }

        async findByEmail(email: string): Promise<IdentityUser | null> {
                const user = await dbClient.identityUser.findUnique({
                        where: { email },
                        include: { tokens: true }
                });

                if (!user) return null;
                return this.mapToDomain(user);
        }

        async findById(id: string): Promise<IdentityUser | null> {
                const user = await dbClient.identityUser.findUnique({
                        where: { id },
                        include: { tokens: true }
                });

                if (!user) return null;
                return this.mapToDomain(user);
        }

        private mapToDomain(raw: any): IdentityUser {
                const tokens = raw.tokens.map((t: any) => {
                        return (RefreshToken as any).rehydrate(
                                {
                                        ...t,
                                        isRevoked: t.revoked
                                },
                                t.id
                        );
                });

                return (IdentityUser as any).rehydrate(
                        {
                                ...raw,
                                tokens
                        },
                        raw.id
                );
        }
}
