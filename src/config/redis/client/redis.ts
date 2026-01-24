import { Redis } from 'ioredis';
import { getEnv } from '../../env/env.js';
import { appLogger } from '../../logger/logger.js';

const envConfig = getEnv();
const redisUrl = envConfig.REDIS_URL;

export class RedisSingleton {
        private static instance: RedisSingleton | null;
        private client: Redis;
        private isConnected: boolean = false;

        private constructor() {
                this.client = new Redis(redisUrl, {
                        lazyConnect: true
                });
        }

        static getInstance() {
                if (RedisSingleton.instance == null) {
                        RedisSingleton.instance = new RedisSingleton();
                        return RedisSingleton.instance;
                }
                return RedisSingleton.instance;
        }

        public getClient(): Redis {
                return this.client;
        }

        public async connect(): Promise<void> {
                if (this.isConnected == true) return;

                const client = this.getClient();

                appLogger.info('....ATTEMPTING CONNECTION TO REDIS');

                await client.connect();

                appLogger.info('....REDIS CONNECTED SUCCESSFULLY');

                this.isConnected = true;
        }

        public async disConnect() {
                if (this.isConnected == false) return;

                const client = this.getClient();

                appLogger.info('....DISCONNECTING FROM REDIS');

                client.disconnect();

                appLogger.info('....REDIS DISCONNECTED SUCCESSFULLY');

                this.isConnected = false;
        }

        public getConnectionStatus(): boolean {
                if (this.isConnected == true) return true;
                else {
                        return false;
                }
        }
}

export const redisSetup = RedisSingleton.getInstance();
export const redisClient = redisSetup.getClient();
