import { DomainErrors } from '../../domain/errors/domainErrors.js';
import { IdentityRepositoryPort } from '../../infrastructure/ports/identityRepositoryPort.js';

interface LogoutRequestDto {
        userId: string;
        refreshToken: string;
}

export class LogoutUser {
        constructor(private readonly identityRepository: IdentityRepositoryPort) {}

        async execute(data: LogoutRequestDto): Promise<{ message: string }> {
                const { userId, refreshToken } = data;

                // 1. Fetch the Aggregate
                const user = await this.identityRepository.findById(userId);
                if (!user) {
                        throw new DomainErrors.UserNotFoundError();
                }

                // 2. Domain Logic: Revoke the specific token
                // You should add a 'revokeToken' method to your IdentityUser aggregate
                const wasRevoked = user.revokeToken(refreshToken);

                if (!wasRevoked) {
                        throw new DomainErrors.InvalidRefreshTokenError();
                }

                // 3. Persist state
                await this.identityRepository.save(user);

                return {
                        message: 'Logged out successfully'
                };
        }
}
