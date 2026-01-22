import { DomainErrors } from '../../domain/errors/domainErrors.js';
import { IdentityRepositoryPort } from '../../infrastructure/ports/IdentityRepositoryPort.js';

interface LogoutRequestDto {
        userId: string;
        refreshToken: string;
}

export class LogoutUser {
        constructor(private readonly identityRepository: IdentityRepositoryPort) {}

        async execute(data: LogoutRequestDto): Promise<{ message: string }> {
                const { userId, refreshToken } = data;

                // 1. Fetch the Aggregate
                const identityUser = await this.identityRepository.findById(userId);
                if (!identityUser) {
                        throw new DomainErrors.UserNotFoundError();
                }

                // 2. Domain Logic: Revoke the specific token
                // You should add a 'revokeToken' method to your IdentityUser aggregate
                const wasRevoked = identityUser.revokeToken(refreshToken);

                if (!wasRevoked) {
                        throw new DomainErrors.InvalidTokenError();
                }

                // 3. Persist state
                await this.identityRepository.save(identityUser);

                return {
                        message: 'Logged out successfully'
                };
        }
}
