import { ValidationError } from "express-validator";

export type ErrorResult = {
    request: string;
    errors: Array<any>;
    status: number;
}

export type BadArgs = {
    request: string;
    message: string;
    errors: Array<ValidationError>;
    status: number;
}

export type InternalError = {
    request: string;
    message: string;
    status: number;
}

export type SuccessResultData = {
    request: string;
    data: any;
    status: number;
}

export type SuccessResult = {
    request: string;
    status: number;
}