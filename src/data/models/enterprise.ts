import { IUser } from "./user";
export interface IEnterprise {
    _id: string;
    cuit?: number;
    name?: string;
    user?: IUser | string;
    description?: string;
    foundationDate?: Date;
    phones?: [string];
    active?: boolean;
    uploadDate?: Date;
    __v?: number;
}
export interface IEnterpriseCreate {
    name: string;
    cuit: number;
    description?: string;
    foundationDate?: Date;
    phones?: [string];
}
export interface IEnterpriseEdit {
    name?: string;
    cuit?: number;
    description?: string;
    foundationDate?: Date;
}