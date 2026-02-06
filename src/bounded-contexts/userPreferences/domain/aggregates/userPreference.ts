import { AggregateRoot } from '@src/shared/ddd/agggragateRoot.Base.js';
import { randomUUID } from 'node:crypto';

interface userPreferenceProps {
        id: string;
        userId: string;
        categories: string[];
        locations: string[];
        minimumSalary: number;
        isAlertsEnabled: boolean;
}

export class UserPreference extends AggregateRoot<userPreferenceProps> {
        private constructor(props: Omit<userPreferenceProps, 'id'>, id: string) {
                super(props, id);
        }

        public static create(props: Omit<userPreferenceProps, 'id'>): UserPreference {
                const id = randomUUID();
                return new UserPreference(
                        {
                                userId: props.userId,
                                categories: props.categories,
                                locations: props.locations,
                                minimumSalary: props.minimumSalary,
                                isAlertsEnabled: props.isAlertsEnabled
                        },
                        id
                );
        }

        public static rehydrate(props: userPreferenceProps): UserPreference {
                return new UserPreference(
                        {
                                userId: props.userId,
                                categories: props.categories,
                                locations: props.locations,
                                minimumSalary: props.minimumSalary,
                                isAlertsEnabled: props.isAlertsEnabled
                        },
                        props.id
                );
        }

        public updateFilters(categories: string[], locations: string[], minSalary: number): void {
                //Rule : Can't have more than 10 categories filter
                if (categories.length > 10) {
                        throw new Error('You cannot follow more than 10 categories.');
                }

                if (minSalary < 0) {
                        throw new Error('Minimum salary cannot be negative.');
                }

                this.props.categories = categories;
                this.props.locations = locations;
                this.props.minimumSalary = minSalary;
        }

        public toggleAlerts(enabled: boolean): void {
                // Rule: Can't enable alerts if they have no categories or locations
                if (enabled && this.props.categories.length === 0 && this.props.locations.length === 0) {
                        throw new Error('Cannot enable alerts with no search criteria.');
                }

                this.props.isAlertsEnabled = enabled;
        }
}
