import { ErrorResult } from "./type.js";

export default (): ErrorResult => {
    return {
        request: "Unknown",
        errors: [
            "Route not found, please visit /docs for more information"
        ],
        status: 404
    }
}