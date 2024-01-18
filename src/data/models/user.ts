'use strict';
import { CommonResponse, IError, u } from "./../utils";
export enum Role {
    OBSERVER = 0,
    NORMAL = 1,
    MODERATOR = 2,
    ADMINISTRATOR = 3
};
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
export interface IUserMethods {
    // Methods:
    isAdmin(): boolean;
    isModerator(): boolean;
    isNormal(): boolean;
    isObserver(): boolean;
    updateRole(role: Role): Promise<CommonResponse>;
    updatePassword(password: string): Promise<CommonResponse>;
    edit(data: IUserEditRequest): Promise<CommonResponse>;
    disable(): Promise<CommonResponse>;
}

export interface MailVerificationSentResponse {
    success: boolean;
    validationId?: string;
    error?: IError;
}
export class User implements IUser, IUserMethods {
    public _id: string;
    public name: string;
    public username: string;
    public email?: string;
    public bio?: string;
    public birth?: Birth | null;
    public role?: number;
    public active?: boolean; 
    constructor(data: IUser) {
        this._id = data._id;
        this.name = data.name;
        this.username = data.username;
        this.email = data.email;
        this.bio = data.bio;
        this.birth = data.birth;
        this.role = data.role;
        this.active = data.active;
    }
    public clone(): User {
        return new User(this);
    }
    /* Methods */
    public isAdmin(): boolean {
        return this.role === Role.ADMINISTRATOR;
    }
    public isModerator(): boolean {
        return this.role === Role.MODERATOR;
    }
    public isNormal(): boolean {
        return this.role === Role.NORMAL;
    }
    public isObserver(): boolean {
        return this.role === Role.OBSERVER;
    }
    
    public async updateRole(role: Role): Promise<CommonResponse> {
        const call = await u.patch(`users/${this.username}`, { role });
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
    }
    public async updatePassword(password: string): Promise<CommonResponse> {
        const call = await u.patch(`users/${this.username}`, { password });
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
    public async edit(data: IUserEditRequest): Promise<CommonResponse> {
        const call = await u.put(`users/${this.username}`, data);
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
    }
    public async disable(): Promise<CommonResponse> {
        const call = await u.del(
            `users/${this.username}`, 
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
    }
    public async recover(): Promise<MailVerificationSentResponse> {
        const call = await u.post(`users/${this.username}/recover`, {});
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
    }
    /* Statics */
    public static async create(data: ISignUpRequest): Promise<CommonResponse> {
        const call = await u.post("users", data);
        if(call != null) {
            const { status } = call;
            if(status === 201) return {
                success: true,
                message: "Usuario creado correctamente. "
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
    public static async findByUsername(username: string): Promise<User> {
        const call = await u.get(`users/${username}`);
        if(call != null) {
            const { status } = call;
            if(status === 200) return new User(await call.json()); else {
                const error: IError = (await call.json()).error;
                return Promise.reject(error);
            }
        }
        return Promise.reject({
            code: "unknown",
            message: "Error desconocido. ",
            details: "Error desconocido. "
        });

    }
    public static async myself(): Promise<User | IError> {
        const call = await u.get(`users/me`);
        if(call != null) {
            const { status } = call;
            if(status === 200) return new User(await call.json()); else {
                const error: IError = (await call.json()).error;
                return error;
            }
        }
        return {
            code: "unknown",
            message: "Error desconocido. ",
            details: "Error desconocido. "
        };
    }
    public static async usernameExists(username: string): Promise<boolean> {
        const call = await u.head(`users/${username}`, {});
        return call !== null && call.status === 200;
    }
    /* Actions on currently logged user */
    public static async updateMail(mail: string): Promise<MailVerificationSentResponse> {
        const call = await u.post("users/me/mail", { mail});
        if(call != null) {
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
    }
    public static async updatePassword(password: string): Promise<CommonResponse> {
        const call = await u.patch(`users/me`, { password });
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
    public static async tryCode(validationId: string, code: string, password?: string): Promise<CommonResponse> {
        const call = await u.post(`users/validate/${validationId}`, { code, password });
        if(call != null) {
            const { status } = call;
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
    public static async edit(data: IUserEditRequest): Promise<CommonResponse> {
        const call = await u.put(`users/me`, data);
        if(call != null) {
            const { status } = call;
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
    public static async disable(): Promise<CommonResponse> {
        const call = await u.del(
            `users/me`, 
            {}
        );
        if(call != null) {
            const { status } = call;
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
}

