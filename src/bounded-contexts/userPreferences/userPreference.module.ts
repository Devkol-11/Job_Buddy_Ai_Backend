import { CreateUserPreference } from './application/commands/createUserPreference/createUserPreferenceHandler.js';
import { UpdateUserPreference } from './application/commands/updateUserPreference/updateUserPreferenceHandler.js';
import { ToggleAlerts } from './application/commands/toogleAlerts/toogleAlertsHandler.js';
import { PrismaUserPreferenceRepo } from './infrastructure/adapters/persistence/writes/prismaUserPreferenceRepository.js';

const createUserPreference = new CreateUserPreference(new PrismaUserPreferenceRepo());
const updateUserPreference = new UpdateUserPreference(new PrismaUserPreferenceRepo());
const toggleAlerts = new ToggleAlerts(new PrismaUserPreferenceRepo());

export const usecaseHttp = {
        createUserPreference,
        updateUserPreference,
        toggleAlerts
};
