import { Response } from 'express';
import { HttpStatusCode } from './httpStatusCodes.js';
import { HttpStatusCodeType } from './httpStatusCodes.js';

export class HttpHelpers {
        static sendResponse(res: Response, statusCode: keyof HttpStatusCodeType | number, data: any) {
                let code: number;

                if (typeof statusCode == 'string') {
                        code = HttpStatusCode[statusCode];
                } else {
                        code = statusCode;
                }

                return res.status(code).json({ data });
        }

        static sendError(res: Response, statusCode: keyof HttpStatusCodeType | number, errorMessage: any) {
                let code: number;
                if (typeof statusCode == 'string') {
                        code = HttpStatusCode[statusCode];
                } else {
                        code = statusCode;
                }
                return res.status(code).json({ errorMessage });
        }
}
