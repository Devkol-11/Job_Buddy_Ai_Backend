export type CreateUserPreferenceCommand = {
        userId: string;
        categories?: string[];
        locations?: string[];
        minimumSalary: number;
        isAlertsEnabled: boolean;
};
