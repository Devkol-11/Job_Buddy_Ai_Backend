import { createTransport, type Transporter } from 'nodemailer';

export class EmailTransport {
        private static transporter: Transporter;

        private static init() {
                if (this.transporter) return;

                this.transporter = createTransport({
                        host: process.env.MAIL_HOST,
                        port: Number(process.env.MAIL_PORT),
                        auth: {
                                user: process.env.MAIL_USER,
                                pass: process.env.MAIL_PASS
                        }
                });
        }

        static async sendMail(input: {
                email: string;
                subject: string;
                body: string;
                firstName: string;
        }): Promise<void> {
                this.init(); // Ensure transporter exists

                const mailOptions = {
                        from: '"JobBuddy AI" <noreply@jobBuddy.ai>',
                        to: input.email,
                        subject: input.subject || `Hello ${input.firstName}`,
                        html: input.body // Using 'html' instead of 'body' for Nodemailer compatibility
                };

                await this.transporter.sendMail(mailOptions);
        }
}
