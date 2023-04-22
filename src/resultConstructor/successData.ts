import { SuccessResultData } from "./type.js";

export default (request: string, data: any): SuccessResultData => {
    return {
        request,
        data,
        status: 200
    };
}