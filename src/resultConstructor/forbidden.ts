import { ErrorResult } from './type.js';

export default (): ErrorResult => {
    return {
        request: "Unknown",
        errors: [
            "Forbidden"
        ],
        status: 403
    }
}