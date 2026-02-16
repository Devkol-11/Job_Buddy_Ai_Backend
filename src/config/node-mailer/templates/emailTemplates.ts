const styles = {
        container: 'font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #f0f0f0; border-radius: 10px;',
        header: 'color: #1a1a1a; font-size: 24px; font-weight: bold; margin-bottom: 20px;',
        text: 'color: #4a4a4a; line-height: 1.6; font-size: 16px;',
        codeBlock: 'background: #f4f4f4; color: #2c3e50; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 8px; border-radius: 8px; margin: 20px 0; border: 1px dashed #ccc;',
        footer: 'font-size: 12px; color: #a1a1a1; margin-top: 30px; border-top: 1px solid #eee; padding-top: 15px;'
};

export const EmailTemplates = {
        welcome: (name: string) => ({
                subject: `Welcome to the team, ${name}!`,
                body: `
            <div style="${styles.container}">
                <div style="${styles.header}">Welcome aboard!</div>
                <p style="${styles.text}">Hi ${name},</p>
                <p style="${styles.text}">We're thrilled to have you. Our platform is designed to make your job tracking seamless and your career growth inevitable.</p>
                <p style="${styles.text}">Log in now to set your preferences and start receiving curated recommendations.</p>
                <div style="${styles.footer}">If you didn't create an account, please disregard this email.</div>
            </div>`
        }),

        forgotPassword: (token: string) => ({
                subject: `${token} is your verification code`,
                body: `
            <div style="${styles.container}">
                <div style="${styles.header}">Reset your password</div>
                <p style="${styles.text}">Someone requested a password reset for your account. If this was you, use the verification code below:</p>
                <div style="${styles.codeBlock}">${token}</div>
                <p style="${styles.text}">This code is valid for 15 minutes. <strong>Do not share this code with anyone.</strong></p>
                <div style="${styles.footer}">If you didn't request this, you can safely ignore this email.</div>
            </div>`
        }),

        passwordResetSuccess: () => ({
                subject: `Security Alert: Password Changed`,
                body: `
            <div style="${styles.container}">
                <div style="${styles.header}">Password updated</div>
                <p style="${styles.text}">Your password was successfully changed just now.</p>
                <p style="${styles.text}">If you did not perform this action, please secure your account immediately by contacting our support team.</p>
                <div style="${styles.footer}">This is an automated security notification.</div>
            </div>`
        })
};
