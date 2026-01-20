export {};

declare global {
        namespace NodeJS {
                interface ProcessEnv {
                        PORT: number;
                        NODE_ENV: number;
                        DATABASE_URL: string;
                        REDIS_URL: string;
                }
        }
}
