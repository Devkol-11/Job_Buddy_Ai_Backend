import { DomainErrors } from '../../domain/errors/domainErrors.js';
import { DomainService } from '../../domain/service/domainService.js';
import { IdentityRepositoryPort } from '../../infrastructure/ports/IdentityRepositoryPort.js';
import { RefreshToken } from '../../domain/entities/refreshToken.js';

export class ForgotPassword {
        constructor(
                private readonly identityRepository: IdentityRepositoryPort,
                private readonly domainService: DomainService
        ) {}

        async execute(email: string): Promise<{ message: string }> {
                const user = await this.identityRepository.findByEmail(email);

                // Security Tip: Even if user doesn't exist, we usually return a success
                // message to prevent "Email Enumeration" attacks.
                if (!user) return { message: 'If an account exists, a reset link has been sent.' };

                const { value, expiry } = this.domainService.generateResetToken();

                // We use our RefreshToken entity or a specific ResetToken entity
                // Logic: Add this to the user's token collection
                const resetToken = RefreshToken.create({
                        value,
                        identityUserId: user.id,
                        expiresAt: expiry
                });

                user.addToken(resetToken);
                await this.identityRepository.save(user);

                // DISPATCH EVENT: UserForgotPasswordEvent (contains the token for the email service)
                // const events = user.pullDomainEvents();
                // await this.eventDispatcher.dispatch(events);

                return { message: 'If an account exists, a reset link has been sent.' };
        }
}
