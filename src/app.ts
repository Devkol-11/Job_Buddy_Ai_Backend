import Express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { applicationErrorHandler } from './shared/middleware/gloalErrorHandler.js';

export function initializeApplication(): Express.Application {
        const app = Express();
        app.use(Express.json());
        app.use(morgan('combined'));
        app.use(cors({ origin: '*' }));

        app.use(applicationErrorHandler);
        return app;
}
