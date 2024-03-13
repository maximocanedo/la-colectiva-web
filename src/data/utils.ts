import {ConnectionError, Err} from "./error";

const baseUrl: string = 'https://colectiva.com.ar:5050/';
// const baseUrl: string = "http://localhost:5050/";
const call = async (url: string, body: any, method: string, onProgress?: (percentage: number) => void): Promise<Response> => {
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
        if(onProgress !== undefined) {
            const totalSize: number = parseInt(call.headers.get("Content-Length") || '0', 10);
            let loadedSize: number = 0;

            const reader = call.body?.getReader();
            if(!reader) {}
            else {
                while(true) {
                    const { done, value } = await reader.read();
                    if(done) break;
                    loadedSize += value.length;
                    const percentage: number = Math.round((loadedSize / totalSize) * 100);
                    onProgress(percentage);
                }
            }
        }
        if (call === null) throw new Err(ConnectionError);
        else return call as Response;
    } catch(err) {
        if(err instanceof Err) throw err;
    }
    throw new Err(ConnectionError);
};
const get = async (url: string, onProgress?: (percentage: number) => void): Promise<Response> => {
    try {
        const call: Response | null = await fetch(baseUrl + url, {
            method: "GET",
            headers: {
                'Content-Type': "application/json",
                'Authorization': 'Bearer ' + localStorage.getItem("la-colectiva-token")
            }
        });
        if(onProgress !== undefined) {
            const totalSize: number = parseInt(call.headers.get("Content-Length") || '0', 10);
            let loadedSize: number = 0;

            const reader = call.body?.getReader();
            if(!reader) {}
            else {
                while(true) {
                    const { done, value } = await reader.read();
                    if(done) break;
                    loadedSize += value.length;
                    const percentage: number = Math.round((loadedSize / totalSize) * 100);
                    onProgress(percentage);
                }
            }
        }
        if (call === null) throw new Err(ConnectionError);
        else return call as Response;
    } catch(err) {
        if(err instanceof Err) throw err;
    }
    throw new Err(ConnectionError);
};
const post = async (url: string, body: any, onProgress?: (percentage: number) => void): Promise<Response> => await call(url, body, "POST", onProgress);
const put = async (url: string, body: any, onProgress?: (percentage: number) => void): Promise<Response> => await call(url, body, "PUT", onProgress);
const patch = async (url: string, body: any, onProgress?: (percentage: number) => void): Promise<Response> => await call(url, body, "PATCH", onProgress);
const del = async (url: string, body?: any, onProgress?: (percentage: number) => void): Promise<Response> => await call(url, body, "DELETE", onProgress);
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
    baseUrl,
    call,
    get,
    post,
    put,
    patch,
    del,
    head
};