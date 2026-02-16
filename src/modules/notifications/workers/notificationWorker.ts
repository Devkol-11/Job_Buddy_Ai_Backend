import { Job } from 'bullmq';
import { Application_Worker } from '@src/config/redis/workers/worker.js';
import { EmailService } from '@src/config/node-mailer/emailService/emailService.js';

/**
 * Registry: Maps job.name (Event Name) to a specific handler function.
 */
const HandlerRegistry: Record<string, (data: any) => Promise<void>> = {
        USER_REGISTERED: (data) => EmailService.sendWelcome(data.email, data.firstName),
        FORGOT_PASSWORD: (data) => EmailService.sendForgotPassword(data.email, data.token),
        PASSWORD_RESET_SUCCESS: (data) => EmailService.sendPasswordResetSuccess(data.email),
        RECOMMENDATION_READY: (data) => EmailService.send(data.email, data.template)
};

export function startEmailWorker() {
        console.log(' Email Notification Worker: Operational');

        return Application_Worker.create('EMAIL_NOTIFICATION', async (job: Job) => {
                // Use job.name to find the right function in our map
                const handler = HandlerRegistry[job.name];

                if (!handler) {
                        console.error(`[EmailWorker] No handler registered for: ${job.name}`);
                        return;
                }

                await handler(job.data);
        });
}
