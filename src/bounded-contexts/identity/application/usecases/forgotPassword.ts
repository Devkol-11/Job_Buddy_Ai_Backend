import { DomainErrors } from '../../domain/errors/domainErrors.js';
import { DomainService } from '../../domain/service/domainService.js';
import { IdentityRepositoryPort } from '../../infrastructure/ports/identityRepositoryPort.js';
import { ResetToken } from '../../domain/entities/resetToken.js';

export class ForgotPassword {
        constructor(
                private readonly identityRepository: IdentityRepositoryPort,
                private readonly domainService: DomainService
        ) {}

        async execute(email: string): Promise<{ message: string }> {
                const user = await this.identityRepository.findByEmail(email);

                // Even if user doesn't exist, we return a success message to prevent "Email Enumeration" attacks.
                if (!user) return { message: 'If an account exists, a reset link has been sent.' };

                const { value, expiry } = this.domainService.generateResetToken();

                // We use our  ResetToken entity
                // Logic: Add this to the user's token collection
                const resetToken = ResetToken.create({
                        value,
                        identityUserId: user.id,
                        expiresAt: expiry
                });

                user.addResetToken(resetToken);
                await this.identityRepository.save(user);

                // DISPATCH EVENT: UserForgotPasswordEvent (contains the token for the email service)
                // const events = user.pullDomainEvents();
                // await this.eventDispatcher.dispatch(events);

                return { message: 'If an account exists, a reset link has been sent.' };
        }
}
