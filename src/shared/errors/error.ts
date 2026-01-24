export abstract class BaseError extends Error {
        abstract readonly type: 'Domain' | 'Infrastructure';

        constructor(public readonly message: string, public readonly statusCode: number) {
                super(message);
                Error.captureStackTrace(this, this.constructor);
        }
}

export class DomainError extends BaseError {
        readonly type = 'Domain';

        constructor(message: string, statusCode: number) {
                super(message, statusCode);
                Object.setPrototypeOf(this, DomainError.prototype);
        }
}

export class InfrastructureError extends BaseError {
        readonly type = 'Infrastructure';

        constructor(message: string, statusCode: number, public readonly isRetryable: boolean) {
                super(message, statusCode);
                Object.setPrototypeOf(this, InfrastructureError.prototype);
        }
}
