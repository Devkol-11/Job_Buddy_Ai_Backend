import { DomainError } from '@src/shared/errors/error.js';
import { HttpStatusCode } from '@src/shared/http/httpStatusCodes.js';

export class UserAlreadyExistsError extends DomainError {
        constructor(readonly message = 'This user already exists', statusCode = HttpStatusCode.CONFLICT) {
                super(message, statusCode);
                this.message = message;
                this.statusCode = statusCode;
        }
}
