import { IdentityUser } from '../../domain/aggregates/identityUser.js';
import { IdentityCachePort } from '../ports/IdentityCachePort.js';
import { ICache } from '@src/config/index.js';

export class RedisIdentityCache implements IdentityCachePort {
        private readonly prefix = 'identity:user:';

        constructor(private readonly redis: ICache) {}

        async getUser(id: string): Promise<IdentityUser | null> {
                return this.redis.get(`${this.prefix}${id}`);
        }

        async saveUser(user: any) {
                await this.redis.set(`${this.prefix}${user.id}`, user, 3600);
        }

        async invalidate(id: string) {
                await this.redis.delete(`${this.prefix}${id}`);
        }
}
