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
export interface IUserMethods {
    // Methods:
    updateRole(role: Role): Promise<void>;
    updatePassword(password: string): Promise<void>;
    editProfile(data: any): Promise<void>;
    disable(): Promise<void>;
    // Statics: 
    create(data: ISignUpRequest): Promise<CommonResponse>;
    findById(id: string): Promise<IUser>;
    findByEmail(email: string): Promise<IUser>;
    myself(): Promise<IUser>;
    usernameExists(username: string): Promise<boolean>;
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
    updateRole(role: Role): Promise<void> {
        throw new Error("Method not implemented.");
    }
    updatePassword(password: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
    editProfile(data: any): Promise<void> {
        throw new Error("Method not implemented.");
    }
    disable(): Promise<void> {
        throw new Error("Method not implemented.");
    }
    async create(data: ISignUpRequest): Promise<CommonResponse> {
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
    findById(id: string): Promise<IUser> {
        throw new Error("Method not implemented.");
    }
    findByEmail(email: string): Promise<IUser> {
        throw new Error("Method not implemented.");
    }
    myself(): Promise<IUser> {
        throw new Error("Method not implemented.");
    }
    usernameExists(username: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

}
