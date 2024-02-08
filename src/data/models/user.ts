import { CommonResponse, IError, u } from "../utils";
export enum Role {
    OBSERVER = 0,
    NORMAL = 1,
    MODERATOR = 2,
    ADMINISTRATOR = 3
}
type Birth = Date | string | number;

/**
 * Datos necesarios para crear una cuenta. 
 */
export interface ISignUpRequest {
    username: string;
    name: string;
    email: string;
    bio: string;
    birth: Birth;
    password: string;
}
export interface IUser {
    _id: string;
    username: string;
    name: string;
    email?: string;
    bio?: string;
    birth?: Birth | null;
    role?: Role;
    active?: boolean;

}
export interface IUserEditRequest {
    name?: string;
    bio?: string;
    email?: string;
    birth?: Birth | null;
}

export interface MailVerificationSentResponse {
    success: boolean;
    validationId?: string;
    error?: IError;
}

/**
 * Cambia el rol de un usuario.
 * @param username Nombre de usuario cuyo rol se quiere cambiar.
 * @param role Rol al que se quiere cambiar.
 * @returns Respuesta de la operación.
 */
export const updateRole = async (username: string, role: Role): Promise<CommonResponse> => {
    const call = await u.patch(`users/${username}`, { role });
    if(call != null) {
        const { status } = call;
        if(status === 200) return {
            success: true,
            message: "Rol actualizado correctamente. "
        }; else {
            const error: IError = (await call.json()).error;
            return {
                success: false,
                ...error
            };
        }
    }
    return {
        success: false,
        message: "Error desconocido. "
    };
};

/**
 * Cambia la contraseña de un usuario.
 * @param username Nombre de usuario cuya contraseña se quiere cambiar.
 * @param password Nueva contraseña.
 * @returns Respuesta de la operación.
 */
export const updatePassword = async (username: string, password: string): Promise<CommonResponse> => {
    const call = await u.patch(`users/${username}`, { password });
    if(call != null) {
        const { status } = call;
        if(status === 200) return {
            success: true,
            message: "Contraseña actualizada correctamente. "
        }; else {
            const error: IError = (await call.json()).error;
            return {
                success: false,
                ...error
            };
        }
    }
    return {
        success: false,
        message: "Error desconocido. "
    };        
}

/**
 * Edita un usuario.
 * @param username Nombre de usuario a editar.
 * @param data Datos a editar.
 * @returns Respuesta de la operación.
 */
export const edit = async (username: string, data: IUserEditRequest): Promise<CommonResponse> => {
    const call = await u.put(`users/${username}`, data);
    if(call != null) {
        const { status } = call;
        if(status === 200) return {
            success: true,
            message: "Usuario editado correctamente. "
        }; else {
            const error: IError = (await call.json()).error;
            return {
                success: false,
                ...error
            };
        }
    }
    return {
        success: false,
        message: "Error desconocido. "
    };
};

/**
 * Deshabilita un usuario.
 * @param username Nombre de usuario a deshabilitar.
 * @returns Respuesta de la operación.
 */
export const disable = async (username: string): Promise<CommonResponse> => {
    const call = await u.del(
        `users/${username}`, 
        {}
    );
    if(call != null) {
        const { status } = call;
        if(status === 200) return {
            success: true,
            message: "Usuario deshabilitado correctamente. "
        }; else {
            const error: IError = (await call.json()).error;
            return {
                success: false,
                ...error
            };
        }
    }
    return {
        success: false,
        message: "Error desconocido. "
    };
};

/**
 * Envia un correo de verificación para comenzar el proceso de recuperación de cuenta.
 * @param username Nombre de usuario.
 * @returns Objeto con el resultado de la operación y el ID de validación.
 */
export const recover = async (username: string): Promise<MailVerificationSentResponse> => {
    const call = await u.post(`users/${username}/recover`, {});
    if(call !== null) {
        const { status } = call;
        const data = await call.json();
        return {
            success: status === 200,
            ...data
        };
    }
    return {
        success: false
    }
};


export interface ISignUpResponse extends CommonResponse {
    validationId: string | null;
    error?: IError | null;
}
/**
 * Crea una cuenta de usuario.
 * @param data Datos de la cuenta.
 * @returns Respuesta de la operación.
 */
export const create = async (data: ISignUpRequest): Promise<ISignUpResponse> => {
    const call = await u.post("users", data);
    if(call != null) {
        const { status } = call;
        const { code, ...data } = await call.json();
        if(status === 201) return {
            ...data,
            success: true,
            message: "Usuario creado correctamente. "
        }; else {
            const error: IError = (await call.json()).error;
            return {
                validationId: null,
                success: false,
                message: error.message,
                error
            };
        }
    }
    return {
        validationId: null,
        success: false,
        message: "Error desconocido. "
    };
};

// TODO - Probar
/**
 * Busca un usuario por su nombre de usuario.
 * @param username Nombre de usuario.
 * @returns Usuario.
 */
export const findByUsername = async (username: string): Promise<IUser> => {
    const call: Response | null = await u.get(`users/${username}`);
    if(call != null) {
        const { status }: Response = call;
        if(status === 200) return await call.json(); 
        else {
            const error: IError = (await call.json()).error;
            return Promise.reject(error);
        }
    }
    return Promise.reject({
        code: "unknown",
        message: "Error desconocido. ",
        details: "Error desconocido. "
    });

};

/**
 * Obtiene el usuario en sesión.
 * @returns Usuario actual.
 */
export const myself = async (): Promise<IUser | IError> => {
    const call: Response | null = await u.get(`users/me`);
    if(call != null) {
        const { status }: Response = call;
        if(status === 200) return await call.json() as IUser;
        else {
            return (await call.json()).error as IError;
        }
    }
    return {
        code: "unknown",
        message: "Error desconocido. ",
        details: "Error desconocido. "
    } as IError;
}

/**
 * Verifica si un nombre de usuario corresponde a una cuenta existente.
 * @param username Nombre de usuario.
 */
export const usernameExists = async (username: string): Promise<boolean> => {
    const call: Response | null = await u.head(`users/${username}`, {});
    return call !== null && call.status === 200;
}

type IMailSentResponse = { validationId: string } | { error: IError };
interface IMailSentFinalResponse {
    success: boolean;
    validationId?: string;
    error?: IError;
}
/**
 * Actualiza el correo del usuario en sesión.
 * @param mail Correo nuevo.
 */
export const updateMail = async (mail: string): Promise<IMailSentFinalResponse> => {
    const call: Response | null = await u.post("users/me/mail", { mail });
    if(call != null) {
        const { status }: Response = call;
        const data: IMailSentResponse = await call.json();
        return {
            success: status === 200,
            ...data
        };
    }
    return {
        success: false
    }
}

/**
 * Actualiza la contraseña del usuario en sesión.
 * @param password Nueva contraseña.
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
            return {
                success: false,
                ...error
            };
        }
    }
    return {
        success: false,
        message: "Error desconocido. "
    };        
}

/**
 * Verifica un código de validación.
 * @param validationId ID de validación.
 * @param code Código recibido por correo.
 * @param password (Opcional) Nueva contraseña (si se está recuperando la cuenta.)
 * @returns Respuesta de la operación.
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
            return {
                success: false,
                ...error
            };
        }
    }
    return {
        success: false,
        message: "Error desconocido. "
    };        
}

/**
 * Actualiza los datos del usuario en sesión.
 * @param data Datos a actualizar.
 * @returns Resultado de la operación.
 */
export const editMyself = async (data: IUserEditRequest): Promise<CommonResponse> => {
    const call: Response | null = await u.put(`users/me`, data);
    if(call != null) {
        const { status }: Response = call;
        if(status === 200) return {
            success: true,
            message: "Tu cuenta fue editada correctamente. "
        }; else {
            const error: IError = (await call.json()).error;
            return {
                success: false,
                ...error
            };
        }
    }
    return {
        success: false,
        message: "Error desconocido. "
    };
}

/**
 * Deshabilita la cuenta del usuario en sesión.
 * @returns Respuesta de la operación.
 */
export const disableMyself = async (): Promise<CommonResponse> => {
    const call: Response | null = await u.del("users/me", {});
    if(call != null) {
        const { status }: Response = call;
        if(status === 200) return {
            success: true,
            message: "Tu cuenta fue deshabilitada correctamente. "
        }; else {
            const error: IError = (await call.json()).error;
            return {
                success: false,
                ...error
            };
        }
    }
    return {
        success: false,
        message: "Error desconocido. "
    };
}
