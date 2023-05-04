import { ErrorResult } from './type.js';

export default (): ErrorResult => {
    return {
        request: "Unknown",
        errors: [
            "Unauthorized"
        ],
        status: 401
    }
}