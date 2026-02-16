import { createTransport, type Transporter } from 'nodemailer';
import { EmailTemplates } from '../templates/emailTemplates.js';

export const EmailService = {
        private_transporter: null as Transporter | null,

        init() {
                if (this.private_transporter) return this.private_transporter;
                this.private_transporter = createTransport({
                        host: process.env.MAIL_HOST,
                        port: Number(process.env.MAIL_PORT),
                        auth: { user: process.env.MAIL_USER, pass: process.env.MAIL_PASS }
                });
                return this.private_transporter;
        },

        async send(to: string, template: { subject: string; body: string }) {
                const transporter = this.init();
                await transporter.sendMail({
                        from: '"JobBuddy AI" <noreply@jobbuddy.ai>',
                        to,
                        subject: template.subject,
                        html: template.body
                });
        },

        async sendWelcome(email: string, name: string) {
                await this.send(email, EmailTemplates.welcome(name));
        },

        async sendForgotPassword(email: string, token: string) {
                await this.send(email, EmailTemplates.forgotPassword(token));
        },

        async sendPasswordResetSuccess(email: string) {
                await this.send(email, EmailTemplates.passwordResetSuccess());
        }
};
