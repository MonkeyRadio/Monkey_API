import { Request, Response } from "express";

export type AccessToken = {
    username: string;
    tokenFamily: string;
    familyChildNumber: number;
}

export type RefreshToken = {
    tokenFamily: string;
    familyChildNumber: number;
}

export type midAuth = {
    token: string;
    username: string;
    tokenFamily: string;
    familyChildNumber: number
}

export interface RequestM extends Request {
    auth: midAuth
}

export interface ResponseM extends Response {
    
}
