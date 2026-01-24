import { Response } from 'express';

export class HttpHelpers {
        /**
         * Sends a standardized JSON response.
         * Automatically handles setting the Refresh Token in an HTTP-only cookie if provided.
         */
        static sendResponse(
                res: Response,
                statusCode: number,
                data: any,
                tokens?: { accessToken: string; refreshToken: string }
        ) {
                // 1. If a refreshToken exists, set it in a secure HTTP-Only cookie
                if (tokens?.refreshToken) {
                        res.cookie('refreshToken', tokens.refreshToken, {
                                httpOnly: true, // Prevents XSS from reading the token
                                secure: true, // Only send over HTTPS in production
                                sameSite: 'strict', // Prevents CSRF
                                path: '/', // Accessible across the auth domain
                                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 Days in milliseconds
                        });
                }

                // 2. Construct the body
                // We include the accessToken in the JSON so the frontend can use it
                const responseBody = {
                        ...data,
                        ...(tokens?.accessToken && { accessToken: tokens.accessToken })
                };

                return res.status(statusCode).json(responseBody);
        }

        /**
         * Helper specifically for logout to clear the cookie
         */
        static sendLogoutResponse(res: Response) {
                res.clearCookie('refreshToken', {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === 'production',
                        sameSite: 'strict'
                });
                return res.status(200).json({ message: 'Logged out successfully' });
        }

        static sendError(res: Response, statusCode: number, error: object) {
                return res.status(statusCode).json({
                        status: 'error',
                        error
                });
        }
}
