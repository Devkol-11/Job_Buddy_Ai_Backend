export abstract class BaseError extends Error {
        abstract readonly type: 'Domain' | 'Infrastructure';

        constructor(public message: string, public statusCode: number) {
                super(message);
                Error.captureStackTrace(this, this.constructor);
        }
}

export class DomainErrorBase extends BaseError {
        readonly type = 'Domain';

        constructor(message: string, statusCode: number) {
                super(message, statusCode);
                Object.setPrototypeOf(this, DomainErrorBase.prototype);
        }
}

export class InfrastructureErrorBase extends BaseError {
        readonly type = 'Infrastructure';

        constructor(message: string, statusCode: number, public readonly isRetryable: boolean) {
                super(message, statusCode);
                Object.setPrototypeOf(this, InfrastructureErrorBase.prototype);
        }
}
