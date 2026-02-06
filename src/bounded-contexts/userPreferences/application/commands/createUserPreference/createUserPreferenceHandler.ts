import { UserPreferenceRepositoryPort } from '../../../domain/repository/userPreferenceRepository.js';
import { UserPreference } from '../../../domain/aggregates/userPreference.js';
import { CreateUserPreferenceCommand } from './createUserPreferenceCommand.js';

export class CreateUserPreference {
        constructor(private readonly repo: UserPreferenceRepositoryPort) {}

        async execute(command: CreateUserPreferenceCommand): Promise<void> {
                const userPreference = UserPreference.create({
                        userId: command.userId,
                        categories: command.categories ?? [],
                        locations: command.locations ?? [],
                        minimumSalary: command.minimumSalary,
                        isAlertsEnabled: command.isAlertsEnabled
                });

                await this.repo.save(userPreference);
        }
}
