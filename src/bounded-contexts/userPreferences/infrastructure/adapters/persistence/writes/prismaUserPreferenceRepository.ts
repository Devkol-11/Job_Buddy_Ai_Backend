import { dbClient } from '@src/config/prisma/prisma.js';
import { UserPreference } from '@src/bounded-contexts/userPreferences/domain/aggregates/userPreference.js';
import { UserPreferenceRepositoryPort } from '@src/bounded-contexts/userPreferences/domain/repository/userPreferenceRepository.js';

export class PrismaUserPreferenceRepo implements UserPreferenceRepositoryPort {
        async save(userPreference: UserPreference): Promise<void> {
                const data = userPreference.getProps();

                await dbClient.userPreference.upsert({
                        where: { userId: data.userId },
                        update: {
                                categories: data.categories,
                                locations: data.locations,
                                minimumSalary: data.minimumSalary,
                                isAlertsEnabled: data.isAlertsEnabled
                        },
                        create: {
                                id: data.id,
                                userId: data.userId,
                                categories: data.categories,
                                locations: data.locations,
                                minimumSalary: data.minimumSalary,
                                isAlertsEnabled: data.isAlertsEnabled
                        }
                });
        }

        async findByUserId(userId: string): Promise<UserPreference | null> {
                // 1. FETCH FROM DB
                const record = await dbClient.userPreference.findUnique({
                        where: { userId }
                });

                if (!record) return null;

                // 2. EXPLICIT REHYDRATION
                // Turn the DB record back into our Domain Aggregate
                return UserPreference.rehydrate({
                        id: record.id,
                        userId: record.userId,
                        categories: record.categories,
                        locations: record.locations,
                        minimumSalary: record.minimumSalary,
                        isAlertsEnabled: record.isAlertsEnabled
                });
        }
}
