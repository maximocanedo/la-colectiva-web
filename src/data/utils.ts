import {ConnectionError, Err} from "./error";

const baseUrl: string = 'https://colectiva.com.ar:5050/';
const call = async (url: string, body: any, method: string): Promise<Response> => {
    try {
        const call: Response | null = await fetch(baseUrl + url, {
            method,
            headers: {
                'Content-Type': body instanceof FormData ? "multipart/form-data" :
                    (typeof body === "string" ? "text/plain" : "application/json"),
                'Authorization': 'Bearer ' + localStorage.getItem("la-colectiva-token")
            },
            body: body instanceof FormData ? body : ((typeof body === "string") ? body : JSON.stringify(body))
        });
        if (call === null) throw new Err(ConnectionError);
        else return call as Response;
    } catch(err) {
        if(err instanceof Err) throw err;
    }
    throw new Err(ConnectionError);
};
const get = async (url: string): Promise<Response> => {
    try {
        const call: Response | null = await fetch(baseUrl + url, {
            method: "GET",
            headers: {
                'Content-Type': "application/json",
                'Authorization': 'Bearer ' + localStorage.getItem("la-colectiva-token")
            }
        });
        if (call === null) throw new Err(ConnectionError);
        else return call as Response;
    } catch(err) {
        if(err instanceof Err) throw err;
    }
    throw new Err(ConnectionError);
};
const post = async (url: string, body: any): Promise<Response> => await call(url, body, "POST");
const put = async (url: string, body: any): Promise<Response> => await call(url, body, "PUT");
const patch = async (url: string, body: any): Promise<Response> => await call(url, body, "PATCH");
const del = async (url: string, body?: any): Promise<Response> => await call(url, body, "DELETE");
const head = async (url: string): Promise<Response> => {
    try {
        const call: Response | null = await fetch(baseUrl + url, {
            method: "HEAD",
            headers: {
                'Content-Type': "application/json",
                'Authorization': 'Bearer ' + localStorage.getItem("la-colectiva-token")
            }
        });
        if (call === null) throw new Err(ConnectionError);
        else return call as Response;
    } catch(err) {
        if(err instanceof Err) throw err;
    }
    throw new Err(ConnectionError);
};
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