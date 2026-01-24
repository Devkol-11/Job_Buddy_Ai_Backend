import { IdentityUser } from '../../domain/aggregates/identityUser.js';

export interface IdentityCachePort {
        getUser(id: string): Promise<IdentityUser | null>;
        saveUser(user: IdentityUser): Promise<void>;
        invalidate(id: string): Promise<void>;
}
