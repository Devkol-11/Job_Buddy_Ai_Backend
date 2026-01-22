export {};

declare global {
        namespace NodeJS {
                interface ProcessEnv {
                        PORT: number;
                        NODE_ENV: string;
                        DATABASE_URL: string;
                        REDIS_URL: string;
                        JWT_SECRET: string;
                }
        }
}
