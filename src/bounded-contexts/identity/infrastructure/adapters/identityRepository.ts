import { Prisma } from 'generated/prisma/client.js';
import { dbClient } from '@src/config/prisma/prisma.js';
import { TransactionClient } from 'generated/prisma/internal/prismaNamespace.js';
import { IdentityUser } from '../../domain/aggregates/identityUser.js';
import { RefreshToken } from '../../domain/entities/refreshToken.js';
import { ResetToken } from '../../domain/entities/resetToken.js';
import { IdentityRepositoryPort } from '../ports/IdentityRepositoryPort.js';
import { DomainErrors } from '../../domain/errors/domainErrors.js';
import { HttpStatusCode } from '@src/shared/http/httpStatusCodes.js';

export class IdentityRepository implements IdentityRepositoryPort {
        private normalizeRefreshTokens(tokens: RefreshToken[]) {
                return tokens.map((token) => ({
                        id: token.id,
                        value: token.props.value,
                        expiresAt: token.props.expiresAt,
                        isRevoked: token.props.isRevoked, // Note: Prisma field name is isRevoked
                        createdAt: token.props.createdAt,
                        updatedAt: token.props.updatedAt
                }));
        }

        private normalizeResetTokens(tokens: ResetToken[]) {
                return tokens.map((token) => ({
                        id: token.id,
                        value: token.props.value,
                        expiresAt: token.props.expiresAt,
                        isExpired: token.props.isExpired,
                        isValid: token.props.isValid,
                        createdAt: token.props.createdAt,
                        updatedAt: token.props.updatedAt
                }));
        }

        private handleError(err: any, context: string): never {
                const networkErrorCodes = ['ECONNREFUSED', 'ETIMEDOUT', 'ECONNRESET', 'ECONNTIMEOUT'];
                if (networkErrorCodes.includes(err?.code)) {
                        throw new DomainErrors.UserRegistrationError(
                                ' connection timeout , please try again later',
                                HttpStatusCode.INTERNAL_SERVER_ERROR
                        );
                }
                if (err instanceof Prisma.PrismaClientKnownRequestError) {
                        if (err.code === 'P2002') {
                                throw new DomainErrors.UserRegistrationError('Unique constraint violation.');
                        }
                }
                console.error(`[IdentityRepository.${context}]`, err);
                throw new DomainErrors.UserRegistrationError('Operation failed , please try again later.');
        }

        async create(entity: IdentityUser, trx?: TransactionClient): Promise<void> {
                const client = trx ? trx : dbClient;
                const { refreshTokens, resetTokens, ...userData } = entity.getProps();

                try {
                        await client.identityUser.create({
                                data: {
                                        ...userData,
                                        refreshTokens: {
                                                create: this.normalizeRefreshTokens(refreshTokens)
                                        },
                                        resetTokens: {
                                                create: this.normalizeResetTokens(resetTokens)
                                        }
                                }
                        });
                } catch (err) {
                        this.handleError(err, 'create');
                }
        }

        async save(entity: IdentityUser, trx?: TransactionClient): Promise<IdentityUser> {
                const client = trx ? trx : dbClient;
                const { refreshTokens, resetTokens, id, ...userData } = entity.getProps();

                try {
                        await client.identityUser.upsert({
                                where: { id: id },
                                update: {
                                        ...userData,
                                        refreshTokens: {
                                                deleteMany: {},
                                                create: this.normalizeRefreshTokens(refreshTokens)
                                        },
                                        resetTokens: {
                                                deleteMany: {},
                                                create: this.normalizeResetTokens(resetTokens)
                                        }
                                },
                                create: {
                                        id,
                                        ...userData,
                                        refreshTokens: {
                                                create: this.normalizeRefreshTokens(refreshTokens)
                                        },
                                        resetTokens: {
                                                create: this.normalizeResetTokens(resetTokens)
                                        }
                                }
                        });
                        return entity;
                } catch (err) {
                        this.handleError(err, 'save');
                }
        }

        async findByEmail(email: string): Promise<IdentityUser | null> {
                const user = await dbClient.identityUser.findUnique({
                        where: { email },
                        include: { refreshTokens: true, resetTokens: true } // MUST INCLUDE BOTH
                });

                if (!user) return null;
                return this.mapToDomain(user);
        }

        async findByResetToken(tokenValue: string): Promise<IdentityUser | null> {
                // This looks for an IdentityUser where AT LEAST ONE resetToken matches the value
                const user = await dbClient.identityUser.findFirst({
                        where: {
                                resetTokens: {
                                        some: { value: tokenValue }
                                }
                        },
                        include: {
                                refreshTokens: true,
                                resetTokens: true
                        }
                });

                if (!user) return null;
                return this.mapToDomain(user);
        }

        async findById(id: string): Promise<IdentityUser | null> {
                const user = await dbClient.identityUser.findUnique({
                        where: { id },
                        include: { refreshTokens: true, resetTokens: true } // MUST INCLUDE BOTH
                });

                if (!user) return null;
                return this.mapToDomain(user);
        }

        private mapToDomain(raw: any): IdentityUser {
                const refreshTokens = raw.refreshTokens.map((t: any) =>
                        (RefreshToken as any).rehydrate(t, t.id)
                );

                const resetTokens = raw.resetTokens.map((t: any) => (ResetToken as any).rehydrate(t, t.id));

                return (IdentityUser as any).rehydrate({
                        ...raw,
                        refreshTokens,
                        resetTokens
                });
        }

        async existsByEmail(email: string): Promise<boolean> {
                const count = await dbClient.identityUser.count({ where: { email } });
                return count > 0;
        }
}
