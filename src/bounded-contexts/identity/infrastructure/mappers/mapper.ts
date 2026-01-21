type Constructor<T> = new (...args: any[]) => T;

export class Mapper {
        static toDomain<T>(Aggregate: Constructor<T>, props: any, id: string): T {
                // Pass props and id to the aggregate root/entity factory
                // Assumes Aggregate has a private constructor
                return (Aggregate as any).create({ ...props, id }); // or call create() for aggregates
        }

        static toPersistence<T extends { props: any; id: string }>(domain: T): any {
                return {
                        id: domain.id,
                        ...domain.props,
                        // Flatten VOs if needed
                        ...Mapper.flattenValueObjects(domain.props)
                };
        }

        private static flattenValueObjects(props: any) {
                const flat: any = {};
                for (const key in props) {
                        const value = props[key];
                        if (value && typeof value.value !== 'undefined') {
                                flat[key] = value.value; // unwrap VO
                        } else {
                                flat[key] = value;
                        }
                }
                return flat;
        }
}
