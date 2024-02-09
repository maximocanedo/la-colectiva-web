import {IError} from "./utils";

export class Err extends Error implements IError {
    code: string;
    message: string;
    details: string;
    constructor(error: IError) {
        super(error.message);
        this.code = error.code;
        this.message = error.message;
        this.details = error.details;
    }
    public getIError(): IError {
        return { code: this.code, message: this.message, details: this.details };
    }
}

export const ConnectionError: IError = {
    code: "L-01",
    details: "Hubo un error al intentar conectar con el servidor. ",
    message: "Hay problemas con la conexión a internet. "
};