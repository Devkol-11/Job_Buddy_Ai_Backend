import dotenv from 'dotenv';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

interface AppEnvConfig {
        PORT: number;
        DATABASE_URL: string;
        REDIS_URL: string;
        NODE_ENV: string;
        JWT_SECRET: string;
        HUGGING_FACE_API_KEY: string;
}

let envConfig: AppEnvConfig | undefined = undefined;

export function loadEnv() {
        const fileName = import.meta.url;

        const dirName = fileURLToPath(fileName);

        // Going up 4 levels to reach the root where .env lives
        const envPath = path.resolve(dirName, '..', '..', '..', '..', '.env');

        const result = dotenv.config({ path: envPath });

        if (result.error || !process.env.DATABASE_URL) {
                const error = new Error('Failed to load environment variables');
                const refinedError = {
                        name: error.name.toUpperCase(),
                        message: error.message.toUpperCase(),
                        cause: error.cause,
                        stack: error.stack
                };
                throw JSON.stringify(refinedError);
        }

        envConfig = Object.freeze({
                PORT: process.env.PORT,
                NODE_ENV: process.env.NODE_ENV,
                DATABASE_URL: process.env.DATABASE_URL,
                REDIS_URL: process.env.REDIS_URL,
                JWT_SECRET: process.env.JWT_SECRET,
                HUGGING_FACE_API_KEY: process.env.HUGGING_FACE_API_KEY
        });
}

export function getEnv(): AppEnvConfig {
        if (envConfig == undefined) {
                throw new Error('Environment Variables not yet configured');
        }

        return envConfig;
}

loadEnv();
