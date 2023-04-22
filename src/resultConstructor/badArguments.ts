import { ValidationError } from "express-validator";
import { BadArgs } from './type.js';

export default (request: string, badArgs: Array<ValidationError>): BadArgs => {
    return {
        request,
        message: "Bad arguments",
        errors: badArgs,
        status: 400
    }
}

export type ErrorResult = BadArgs;