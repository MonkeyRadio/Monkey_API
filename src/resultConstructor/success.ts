import { SuccessResult } from "./type.js";

export default (request: string, status: number = 200): SuccessResult => {
    return {
        request,
        status: status,
    };
}
