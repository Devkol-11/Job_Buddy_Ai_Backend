import { DomainErrors } from '../../domain/errors/domainErrors.js';
import { DomainService } from '../../domain/service/domainService.js';
import { IdentityRepositoryPort } from '../../infrastructure/ports/IdentityRepositoryPort.js';

export class ResetPassword {
        constructor(
                private readonly identityRepository: IdentityRepositoryPort,
                private readonly domainService: DomainService
        ) {}

        async execute(data: ResetPasswordRequestDto): Promise<{ message: string }> {
                const { token, newPassword } = data;

                // 1. Find user by the token value
                // (Note: You may need a findByToken method in your repo)
                const user = await this.identityRepository.findByToken(token);
                if (!user) throw new DomainErrors.InvalidTokenError();

                // 2. Domain Logic: Validate and Revoke Token
                const tokenEntity = user.props.tokens.find((t) => t.props.value === token);
                if (!tokenEntity || tokenEntity.isExpired() || tokenEntity.props.isRevoked) {
                        throw new DomainErrors.InvalidTokenError();
                }

                // 3. Update Password
                const newHash = await this.domainService.encryptPassword(newPassword);
                user.updatePassword(newHash); // Update this method in your IdentityUser

                // 4. Cleanup: Revoke the reset token so it can't be used again
                tokenEntity.revoke();

                await this.identityRepository.save(user);

                return { message: 'Password has been reset successfully.' };
        }
}
