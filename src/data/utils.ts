'use strict';
const baseUrl = 'https://colectiva.com.ar:5050/';
const call = async (url: string, body: any, method: string): Promise<Response | null> => {
    try {
        return await fetch(baseUrl + url, {
            method,
            headers: {
                'Content-Type': typeof body === "string" ? "text/plain" : "application/json",
                'Authorization': 'Bearer ' + localStorage.getItem("la-colectiva-token")
            },
            body: (typeof body === "string") ? body : JSON.stringify(body)
        });
    } catch(error: any) {
        console.log(error);
    }
    return null;
};
const get = async (url: string): Promise<Response | null> => {
    try {
        return await fetch(baseUrl + url, {
            method: "GET",
            headers: {
                'Content-Type': "application/json",
                'Authorization': 'Bearer ' + localStorage.getItem("la-colectiva-token")
            }
        });
    } catch(error: any) {
        console.log(error);
    }
    return null;
};
const post = async (url: string, body: any): Promise<Response | null> => await call(url, body, "POST");
const put = async (url: string, body: any): Promise<Response | null> => await call(url, body, "PUT");
const patch = async (url: string, body: any): Promise<Response | null> => await call(url, body, "PATCH");
const del = async (url: string, body?: any): Promise<Response | null> => await call(url, body, "DELETE");
const head = async (url: string, body: any): Promise<Response | null> => await call(url, body, "HEAD");
export interface IError {
    code: string;
    message: string;
    details: string;
}
export interface CommonResponse {
    success: boolean;
    message: string;
    details?: string;
    code?: string;
    data?: any | null;
    error?: IError;
}
export const u = {
    call,
    get,
    post,
    put,
    patch,
    del,
    head
};