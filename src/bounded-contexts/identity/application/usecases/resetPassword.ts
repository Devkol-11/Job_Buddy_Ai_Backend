import { DomainErrors } from '../../domain/errors/domainErrors.js';
import { DomainService } from '../../domain/service/domainService.js';
import { IdentityRepositoryPort } from '../../infrastructure/ports/identityRepositoryPort.js';
import { ResetPasswordRequestDto } from '../dtos/domainDto.js';

export class ResetPassword {
        constructor(
                private readonly identityRepository: IdentityRepositoryPort,
                private readonly domainService: DomainService
        ) {}

        async execute(data: ResetPasswordRequestDto): Promise<{ message: string }> {
                const { token, newPassword } = data;

                // Fetch user
                const user = await this.identityRepository.findByResetToken(token);

                if (!user)
                        throw new DomainErrors.InvalidResetTokenError('No user associated with this token.');

                const newHash = await this.domainService.encryptPassword(newPassword);

                // If anything is wrong, this line will throw and the method stops.
                user.resetPassword(token, newHash);

                // 4. Persist (I/O)
                await this.identityRepository.save(user);

                return { message: 'Password has been reset successfully.' };
        }
}
