import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { HttpHelpers } from '@src/shared/http/httpHelpers.js';
import { HttpStatusCode } from '@src/shared/http/httpStatusCodes.js';
import { getEnv } from '@src/config/env/env.js';

const config = getEnv();

/**
 * Generic Role Authorization Middleware
 * @param allowedRoles - A single role string or an array of allowed roles
 */
export function authorizeRole(allowedRoles: string | string[]) {
        return (req: Request, res: Response, next: NextFunction) => {
                try {
                        const authHeader = req.headers.authorization;

                        if (!authHeader || !authHeader.startsWith('Bearer ')) {
                                return HttpHelpers.sendResponse(res, HttpStatusCode.UNAUTHORIZED, {
                                        message: 'No token provided'
                                });
                        }

                        const token = authHeader.split(' ')[1];

                        // 1. Verify and Type the Payload
                        const decoded = jwt.verify(token, config.JWT_SECRET) as {
                                id: string;
                                email: string;
                                role: string;
                        };

                        // 2. Normalize allowedRoles to an array for easy checking
                        const rolesArray = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

                        // 3. Check if the user's role is in the allowed list
                        const hasAccess = rolesArray.includes(decoded.role.toUpperCase());

                        if (!hasAccess) {
                                return HttpHelpers.sendResponse(res, HttpStatusCode.FORBIDDEN, {
                                        message: `Access denied.`
                                });
                        }

                        // 4. Attach user to request for use in handlers/controllers
                        (req as any).user = decoded;

                        next();
                } catch (error) {
                        return HttpHelpers.sendResponse(res, HttpStatusCode.UNAUTHORIZED, {
                                message: 'Invalid or expired token'
                        });
                }
        };
}
