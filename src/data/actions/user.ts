import {
    IMailSentFinalResponse, IMailSentResponse,
    ISignUpRequest,
    ISignUpResponse,
    IUser,
    IUserEditRequest,
    MailVerificationSentResponse,
    Role
} from "../models/user";
import { CommonResponse, IError, u } from "../utils";
import { ConnectionError, Err } from "../error";


import {Myself, UserLogged} from "../../components/page/definitions";
/**
 * **Actualizar rol**
 *
 * Cambia el rol de un usuario.
 * @param username Nombre de usuario cuyo rol se quiere cambiar.
 * @param role Rol al que se quiere cambiar.
 * @returns Respuesta de la operación.
 *
 * @Last-tested Feb 09 morning
 * @author Máximo Canedo (@maximocanedo)
 */
export const updateRole = async (username: string, role: Role): Promise<CommonResponse> => {
    const call: Response = await u.patch(`users/${username}`, { role });
    const { status }: Response = call;
    if (status === 200) return {
        success: true,
        message: "Rol actualizado correctamente. "
    };
    else {
        throw new Err((await call.json()).error as IError);
    }
}; // Tested: OK.
/**
 * **Actualizar contraseña**
 *
 * Cambia la contraseña de un usuario.
 * @param username Nombre de usuario cuya contraseña se quiere cambiar.
 * @param password Nueva contraseña.
 * @returns Respuesta de la operación.
 *
 * @Last-tested Feb 09 morning
 * @author Máximo Canedo (@maximocanedo)
 */
export const updatePassword = async (username: string, password: string): Promise<CommonResponse> => {
    const call: Response = await u.patch(`users/${username}`, { password });
    const { status }: Response = call;
    if(status === 200) return {
        success: true,
        message: "Contraseña actualizada correctamente. "
    }; else {
        const error: IError = (await call.json()).error;
        throw new Err(error);
    }
}; // Tested: OK.
/**
 * **Editar usuario**
 *
 * Edita la información del perfil de un usuario.
 * @param username Nombre de usuario a editar.
 * @param data Datos a editar.
 * @returns Respuesta de la operación.
 *
 * @Last-tested Feb 09 morning
 * @author Máximo Canedo (@maximocanedo)
 */
export const edit = async (username: string, data: IUserEditRequest): Promise<CommonResponse> => {
    const call: Response | null = await u.put(`users/${username}`, data);
    if(call != null) {
        const { status }: Response = call;
        if(status === 200) return {
            success: true,
            message: "Usuario editado correctamente. "
        }; else {
            const error: IError = (await call.json()).error;
            throw new Err(error);
        }
    }
    throw new Err(ConnectionError);
}; // Tested: OK.
/**
 * **Deshabilitar usuario**
 *
 * Deshabilita un usuario.
 * @param username Nombre de usuario a deshabilitar.
 * @returns Respuesta de la operación.
 *
 * @Last-tested Feb 09 morning
 * @author Máximo Canedo (@maximocanedo)
 */
export const disable = async (username: string): Promise<CommonResponse> => {
    const call: Response = await u.del(`users/${username}`);
    const { status }: Response = call;
    if(status === 200) return {
        success: true,
        message: "Usuario deshabilitado correctamente. "
    }; else {
        const error: IError = (await call.json()).error;
        throw new Err(error);
    }
}; // Tested: OK.
/**
 * **Recuperar cuenta. Primer paso.**
 *
 * Envía un correo de verificación para comenzar el proceso de recuperación de cuenta.
 * @param username Nombre de usuario.
 * @returns Objeto con el resultado de la operación y el ID de validación.
 *
 * @Last-tested Feb 09 morning
 * @author Máximo Canedo (@maximocanedo)
 */
export const recover = async (username: string): Promise<MailVerificationSentResponse> => {
    const call: Response = await u.post(`users/${username}/recover`, {});
    const { status }: Response = call;
    const data = await call.json();
    if(status === 200) return { success: true, ...data };
    else throw new Err(data.error as IError);
};
/**
 * **Registrar nuevo usuario**
 *
 * Crea una cuenta de usuario.
 * @param data Datos de la cuenta.
 * @returns Respuesta de la operación.
 *
 * @Last-tested Feb 09 morning
 * @author Máximo Canedo (@maximocanedo)
 */
export const create = async (data: ISignUpRequest): Promise<ISignUpResponse> => {
    const call: Response = await u.post("users", data);
    const { validationId, error, ...y } = await call.json();
    if(call.ok) return { ...y, validationId, success: true, message: "OK" };
    throw new Err(error);
}; // Tested: OK ("65c66cedc2989e8aadd55f15" validationId)
/**
 * **Buscar usuario**
 *
 * Busca un usuario por su nombre de usuario.
 * @param username Nombre de usuario.
 * @returns Usuario.
 *
 * @Last-tested Feb 09 morning
 * @author Máximo Canedo (@maximocanedo)
 */
export const findByUsername = async (username: string): Promise<IUser> => {
    const call: Response | null = await u.get(`users/${username}`);
    if(call != null) {
        const { status }: Response = call;
        if(status === 200) return await call.json();
        else {
            const error: IError = (await call.json()).error;
            throw new Err(error);
        }
    }
    throw new Err(ConnectionError);
}; // Tested: OK
/**
 * **Usuario actual**
 *
 * Obtiene el usuario en sesión.
 * @returns Usuario actual.
 *
 * @Last-tested Feb 09 morning
 * @author Máximo Canedo (@maximocanedo)
 */
export const myself = async (): Promise<UserLogged> => {
    const call: Response | null = await u.get(`users/me`);
    if(call != null) {
        const { status }: Response = call;
        if(status === 200) return await call.json() as UserLogged;
        else {
            const e: IError = (await call.json()).error as IError;
            throw new Err(e);
        }
    }
    throw new Err(ConnectionError);
}; // Tested: OK
/**
 * **Comprobar disponibilidad de nombre de usuario**
 *
 * Verifica si un nombre de usuario corresponde a una cuenta existente.
 * @param username Nombre de usuario.
 *
 * @Last-tested Feb 09 morning
 * @author Máximo Canedo (@maximocanedo)
 */
export const usernameExists = async (username: string): Promise<boolean> => {
    const call: Response | null = await u.head(`users/${username}`);
    return call !== null && call.status === 200;
}; // Tested: OK
/**
 * **Actualizar correo**
 *
 * Actualiza el correo del usuario en sesión.
 * @param mail Correo nuevo.
 * @author Máximo Canedo (@maximocanedo)
 */
export const updateMail = async (mail: string): Promise<IMailSentFinalResponse> => {
    const call: Response | null = await u.post("users/me/mail", { mail });
    if(call != null) {
        const { status }: Response = call;
        const data: IMailSentResponse = await call.json();
        if(status === 200) return {
            success: true,
            ...data
        }; else throw new Err(data.error as IError);
    }
    throw new Err(ConnectionError);
};
/**
 * **Cambiar contraseña**
 *
 * Actualiza la contraseña del usuario en sesión.
 * @param password Nueva contraseña.
 * @last-tested 10/02/24 16:46
 * @author Máximo Canedo (@maximocanedo)
 */
export const updateMyPassword = async (password: string): Promise<CommonResponse> => {
    const call: Response | null = await u.patch(`users/me`, { password });
    if(call != null) {
        const { status }: Response = call;
        if(status === 200) return {
            success: true,
            message: "Contraseña actualizada correctamente. "
        }; else {
            const error: IError = (await call.json()).error;
            throw new Err(error);
        }
    }
    throw new Err(ConnectionError);
};
/**
 * **Validar código de verificación**
 *
 * Verifica un código de validación.
 * @param validationId ID de validación.
 * @param code Código recibido por correo.
 * @param password (Opcional) Nueva contraseña (si se está recuperando la cuenta.)
 *
 * @notes A la espera de reparación.
 * @tested API Error. Only works when you got a valid token.
 * @Last-tested Feb 09 morning
 * @returns Respuesta de la operación.
 * @author Máximo Canedo (@maximocanedo)
 */
export const tryCode = async (validationId: string, code: string, password?: string): Promise<CommonResponse> => {
    const call: Response | null = await u.post(`users/validate/${validationId}`, { code, password });
    if(call != null) {
        const { status }: Response = call;
        if(status === 204) return {
            success: true,
            message: "Cuenta verificada/recuperada correctamente. "
        }; else {
            const error: IError = (await call.json()).error;
            throw new Err(error);
        }
    }
    throw new Err(ConnectionError);
};
/**
 * **Editar perfil**
 *
 * Actualiza los datos del usuario en sesión.
 * @param data Datos a actualizar.
 * @returns Resultado de la operación.
 * @last-tested 10/02/24 16:45
 * @author Máximo Canedo (@maximocanedo)
 */
export const editMyself = async (data: IUserEditRequest): Promise<CommonResponse> => {
    const call: Response = await u.put(`users/me`, data);
    const { status }: Response = call;
    if(status === 200) return {
        success: true,
        message: "Tu cuenta fue editada correctamente. "
    }; else {
        const error: IError = (await call.json()).error;
        throw new Err(error);
    }
};
/**
 * **Deshabilitar cuenta actual**
 *
 * Deshabilita la cuenta del usuario en sesión.
 * @returns Respuesta de la operación.
 * @last-tested 10/02/24 16:43
 * @author Máximo Canedo (@maximocanedo)
 */
export const disableMyself = async (): Promise<CommonResponse> => {
    const call: Response = await u.del("users/me", {});
    const { status }: Response = call;
    if(status === 200) return {
        success: true,
        message: "Tu cuenta fue deshabilitada correctamente. "
    }; else {
        const error: IError = (await call.json()).error;
        throw new Err(error);
    }
};