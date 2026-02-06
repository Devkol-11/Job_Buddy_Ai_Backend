import { DomainErrors } from '../../domain/exceptions/domainErrors.js';
import { RefreshToken } from '../../domain/model/aggregates/refreshToken.js';
import { DomainService } from '../../domain/service/domainService.js';
import { IdentityRepositoryPort } from '../ports/identityRepositoryPort.js';
import { RefreshTokenRepositoryPort } from '../ports/refreshRepositoryTokenPort.js';
import { TransactionScriptPort } from '../ports/transactionManagerPort.js';

export class TokenRefresh {
        constructor(
                private readonly refreshTokenRepository: RefreshTokenRepositoryPort,
                private readonly identityRepository: IdentityRepositoryPort,
                private readonly domainService: DomainService,
                private readonly unitOfWork: TransactionScriptPort
        ) { }

        async execute(refreshTokenValue: string) {
                // Find the token
                const token = await this.refreshTokenRepository.findByValue(refreshTokenValue);

                if (!token) {
                        throw new DomainErrors.InvalidRefreshTokenError();
                }

                // REUSE DETECTION: If token was already revoked, someone is cheating.
                if (token.isRevoked()) {
                        await this.refreshTokenRepository.deleteAllForUser(token.props.identityUserId);
                        throw new DomainErrors.InvalidRefreshTokenError("Token reuse detected. All sessions invalidated.");
                }

                // Find User (ID should come from the token object, not user input)
                const user = await this.identityRepository.findById(token.props.identityUserId)
                if (!user) throw new DomainErrors.UserNotFoundError();

                // Perform Rotation
                token.revoke(); // Mark as revoked
                const { value, expiry } = this.domainService.generateRefreshTokenWithExpiry();
                const accessToken = this.domainService.generateAccessToken(user.getClaims());

                const newRefreshToken = RefreshToken.create({
                        value,
                        identityUserId: user.id,
                        expiresAt: expiry
                });

                await this.unitOfWork.run(async (trx) => {
                        await this.refreshTokenRepository.save(newRefreshToken, trx);
                        await this.refreshTokenRepository.save(token, trx); // Update status 
                });

                return { accessToken, refreshToken: newRefreshToken.props.value };
        }
}
