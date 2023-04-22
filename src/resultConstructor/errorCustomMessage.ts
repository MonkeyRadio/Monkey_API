import { ErrorResult } from "./type.js";

export default (request: string, message: string, code: number): ErrorResult => {
    return {
        request,
        errors: [
            message
        ],
        status: code
    }
}