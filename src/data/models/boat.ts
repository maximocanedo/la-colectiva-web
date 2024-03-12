import { IEnterprise } from "./enterprise";
import { IUser } from "./user";

export interface IBoat {
    _id: string;
    mat?: string;
    name?: string;
    status?: boolean;
    enterprise?: IEnterprise | string;
    user?: IUser | string;
    uploadDate?: Date;
    active?: boolean;
    __v?: number;
}

export interface IBoatCreate {
    mat: string;
    name: string;
    enterprise: string;
    status: boolean;
}

export interface IBoatEdit {
    mat?: string;
    name?: string;
    enterprise?: string;
    status?: boolean;
}