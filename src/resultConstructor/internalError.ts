import { InternalError } from './type.js';

export default (request: string): InternalError => {
    return {
        request,
        message: "Internal Server Error",
        status: 500
    }
}

export type ErrorResult = InternalError;