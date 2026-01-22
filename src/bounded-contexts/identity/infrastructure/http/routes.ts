import { Router } from 'express';
import { HttpHelpers } from '@src/shared/http/httpHelpers.js';
import { HttpStatusCode } from '@src/shared/http/httpStatusCodes.js';
import { protectHandler } from '@src/shared/helpers/catchAsync.js';

export function IdentityRoutes() {
        const identityRouter = Router();

        identityRouter.post(
                '/register',
                protectHandler(async (req, res) => {})
        );

        identityRouter.post(
                'login',
                protectHandler(async (req, res) => {})
        );

        identityRouter.post(
                'forgot-password',
                protectHandler((req, res) => {})
        );

        identityRouter.post(
                'reset-password',
                protectHandler((req, res) => {})
        );

        return identityRouter;
}
