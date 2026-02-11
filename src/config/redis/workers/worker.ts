import { Worker, Job } from 'bullmq';
import { redisClient } from '../client/redis.js';

export class Application_Worker {
        private static client = redisClient;

        /**
         * @param name - The name of the queue to listen to
         * @param onReceive - The async function to process the job
         */
        public static create(name: string, onReceive: (job: Job) => Promise<void>): Worker {
                return new Worker(
                        name,
                        async (job) => {
                                await onReceive(job);
                        },
                        {
                                connection: this.client,
                                // Default concurrency (how many jobs it does at once)
                                concurrency: 5
                        }
                );
        }
}
