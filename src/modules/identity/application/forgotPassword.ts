import { IdentityService } from '../service/identityService.js';
import type { ResetToken } from 'generated/prisma/client.js';
import { IdentityRepository } from '../Repository/identityRepo.js';
import { ResetTokenRepository } from '../Repository/resetTokenRepo.js';
import { IdentityEvents } from '../helpers/events/identityEvents.js';
import { randomUUID } from 'node:crypto';
import { EmailNotificationDispatcher } from '@src/config/redis/jobQueue/Queue.js';

export class ForgotPassword {
        private identityRepo: IdentityRepository = new IdentityRepository();
        private identityService: IdentityService = new IdentityService();
        private resetTokenRepo: ResetTokenRepository = new ResetTokenRepository();
        private emailNotificationDispatcher: EmailNotificationDispatcher = new EmailNotificationDispatcher();

        async execute(email: string): Promise<{ message: string }> {
                const user = await this.identityRepo.findByEmail(email);

                // Even if user doesn't exist, we return a success message to prevent "Email Enumeration" attacks.
                if (!user) return { message: 'If an account exists, a reset link has been sent.' };

                // Ensuring only one active token at a time
                const existingToken = await this.resetTokenRepo.findActiveByUserId(user.id);

                if (existingToken) {
                        existingToken.isExpired = true;
                        existingToken.isValid = false;
                        await this.resetTokenRepo.delete(existingToken.id);
                }

                const { value, expiry } = this.identityService.generateResetToken();

                const resetToken: ResetToken = {
                        id: randomUUID(),
                        identityUserId: user.id,
                        value,
                        isExpired: false,
                        isValid: true,
                        expiresAt: expiry,
                        createdAt: new Date(),
                        updatedAt: new Date()
                };

                await this.resetTokenRepo.save(resetToken);

                const forgotPasswordEvent = new IdentityEvents.UserForgotPasswordEvent({
                        userId: user.id,
                        email: user.email,
                        token: value
                });

                await this.emailNotificationDispatcher.dispatch(
                        forgotPasswordEvent.eventName,
                        forgotPasswordEvent.data
                );

                return { message: 'If an account exists, a reset link has been sent.' };
        }
}
