export abstract class Entity<T> {
        protected id: number;
        props: T;
        constructor(props: T, id: number) {
                this.id = id;
                this.props = props;
        }

        public equals(object: Entity<T>): boolean {
                return this.id == object.id;
        }
}
