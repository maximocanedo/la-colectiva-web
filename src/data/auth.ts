'use strict';
import { u, CommonResponse, IError } from './utils';
type CommonCredentials = {
    password: string;
};

export type Credentials = {
    username: string;
} & CommonCredentials | {
    email: string;
} & CommonCredentials;

export type LoginSuccessfulResponse = {
    token: string;
}

export const login = async (data: Credentials): Promise<CommonResponse> => {
    const call = await u.post("auth", data);
    if(call !== null) {
        const { status } = call;
        if(status === 200) {
            const res: LoginSuccessfulResponse = await call.json();
            localStorage.setItem("la-colectiva-token", res.token);
            return {
                success: true,
                message: "Inicio de sesión exitoso. "
            };
        } else {
            const res: IError = await call.json();
            return {
                success: false,
                ...res
            };
        }
    }
    return {
        success: false,
        message: "Error de conexión. "
    };
};

export const logout = (): CommonResponse => {
    if(localStorage.getItem("la-colectiva-token") === null) {
        return {
            success: false,
            message: "No hay sesión iniciada. "
        };
    }
    localStorage.removeItem("la-colectiva-token");
    return {
        success: true,
        message: "Cierre de sesión exitoso. "
    };
};
