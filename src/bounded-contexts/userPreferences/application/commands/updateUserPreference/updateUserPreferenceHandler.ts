import { UpdateUserPreferenceCommand } from './updateUserPreferenceCommand.js';
import { UserPreferenceRepositoryPort } from '@src/bounded-contexts/userPreferences/domain/repository/userPreferenceRepository.js';

export class UpdateUserPreference {
        constructor(private readonly repo: UserPreferenceRepositoryPort) {}

        async execute(command: UpdateUserPreferenceCommand): Promise<void> {
                const profile = await this.repo.findByUserId(command.userId);

                if (!profile) {
                        throw new Error('User preference profile not found.');
                }

                profile.updateFilters(command.categories, command.locations, command.minimumSalary);

                await this.repo.save(profile);
        }
}
