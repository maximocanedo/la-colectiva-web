import { u, CommonResponse } from './utils';
import {Err} from "./error";

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

/**
 * **Iniciar sesión**
 *
 * Intenta iniciar sesión con las credenciales dadas.
 *
 * Si el inicio de sesión fue exitoso, guarda el token en memoria para su posterior uso.
 * @param data Credenciales del usuario.
 * @last-tested 10/02/24 09:34
 * @author Máximo Canedo (@maximocanedo)
 */
export const login = async (data: Credentials): Promise<CommonResponse> => {
    const call: Response = await u.post("auth", data);
    const { token, error } = await call.json();
    if(call.ok) {
        localStorage.setItem("la-colectiva-token", token);
        return { success: true, message: "Inicio de sesión exitoso. " };
    } throw new Err(error);
};
/**
 * **Cerrar sesión**
 *
 * Elimina de la memoria el token de usuario.
 * @author Máximo Canedo (@maximocanedo)
 */
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
