export type UpdateUserPreferenceCommand = {
        userId: string;
        categories: string[];
        locations: string[];
        minimumSalary: number;
};
