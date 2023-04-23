import { Request, Response } from "express";

export interface RequestM extends Request {
    auth: {
        token: string;
    };
}

export interface ResponseM extends Response {
    
}