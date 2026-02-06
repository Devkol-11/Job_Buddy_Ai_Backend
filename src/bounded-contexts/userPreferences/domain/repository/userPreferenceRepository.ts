import { UserPreference } from '../aggregates/userPreference.js';
export interface UserPreferenceRepositoryPort {
        save(userPreference: UserPreference): Promise<void>;
        findByUserId(userId: string): Promise<UserPreference | null>;
}
