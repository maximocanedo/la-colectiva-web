'use strict';

import { CommonResponse, u, IError } from "../utils";
import { Comment, IPaginator, ICommentFetchResponse, ICommentCreationResponse } from "./comment";
import { Dock } from "./dock";
import { Region } from "./region";
import { IUser } from "./user";
import { VoteStatus, downvote, getVotes, upvote } from "./vote";

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

interface IEnterpriseCreate {
    name: string;
    cuit: number;
    description?: string;
    foundationDate?: Date;
    phones?: [string];
}

interface IEnterpriseEdit {
    name: string;
    cuit: number;
    description: string;
    foundationDate: Date;
}

export class Enterprise implements IEnterprise {
    public _id: string;
    public cuit?: number;
    public name?: string;
    public user?: IUser | string;
    public description?: string;
    public foundationDate?: Date;
    public phones?: [string];
    public active?: boolean;
    public uploadDate?: Date;
    public __v?: number;

    constructor(data: IEnterprise) {
        this._id = data._id;
        this.cuit = data.cuit;
        this.name = data.name;
        this.user = data.user;
        this.description = data.description;
        this.foundationDate = data.foundationDate;
        this.phones = data.phones;
        this.active = data.active;
        this.uploadDate = data.uploadDate;
        this.__v = data.__v;
    }

    
    public async edit(data: IEnterpriseEdit): Promise<CommonResponse> {
        const call = await u.put(this.getAPIPrefix(), data);
        if(call !== null) {
            const { status } = call;
            if(status == 200) return {
                success: true,
                message: "Edición exitosa. "
            };
            else {
                const { error }: { error: IError } = await call.json();
                return {
                    success: false,
                    ...error
                };
            }
        } return {
            success: false,
            message: "Error de conexión. "
        };
    }
    public async delete(): Promise<CommonResponse> {
        const call = await u.del(this.getAPIPrefix(), {});
        if(call == null) return {
            success: false,
            message: "Error de conexión. "
        };
        const { status } = call;
        if(status === 200) return {
            success: true,
            message: "Eliminación exitosa. "
        };
        else {
            const { error }: { error: IError } = await call.json();
            return {
                success: false,
                ...error
            };
        }
    }
    public static async create(enterprise: IEnterpriseCreate): Promise<CommonResponse> {
        const call = await u.post("enterprises", enterprise);
        if(call == null) return {
            success: false,
            message: "Error de conexión. "
        };
        const { status } = call;
        if(status === 201) {
            const data = await call.json();
            return {
                success: true,
                message: "Creación exitosa. ",
                data: new Enterprise({
                    ...enterprise,
                    _id: data._id
                })
            };
        }
        else {
            const { error }: { error: IError } = await call.json();
            return {
                success: false,
                ...error
            };
        }
    }
    public static async find(id: string): Promise<Enterprise> {
        const call = await u.get("enterprises/" + id);
        if(call == null) return Promise.reject({
            code: "unknown-error",
            message: "Error de conexión. ",
            details: "No se pudo conectar con el servidor. "
        });
        const { status } = call;
        if(status === 200) {
            const data = await call.json();
            return new Enterprise(data);
        } return Promise.reject(await call.json());
    }
    public static async list(): Promise<Enterprise[]> {
        const call = await u.get("enterprises");
        if(call == null) return Promise.reject({
            code: "unknown-error",
            message: "Error de conexión. ",
            details: "No se pudo conectar con el servidor. "
        });
        const { status } = call;
        if(status === 200) {
            const data = await call.json();
            return data.map((data: IEnterprise) => new Enterprise(data));
        } return Promise.reject(await call.json());
    }
    public async getPhones(): Promise<string[]> {
        const call = await u.get(this.getAPIPrefix() + "/phones");
        if(call == null) return [];
        const { status } = call;
        if(status === 200) {
            const data = await call.json();
            return data;
        } return [];
    }
    public async addPhone(phone: string): Promise<CommonResponse> {
        const call = await u.post(this.getAPIPrefix() + "/phones", { phone });
        if(call == null) return {
            success: false,
            message: "Error de conexión. "
        };
        const { status } = call;
        if(status === 200) return {
            success: true,
            message: "Teléfono agregado. "
        };
        else {
            const { error }: { error: IError } = await call.json();
            return {
                success: false,
                ...error
            };
        }
    }
    public async deletePhone(phone: string): Promise<CommonResponse> {
        const call = await u.del(this.getAPIPrefix() + "/phones", { phone });
        if(call == null) return {
            success: false,
            message: "Error de conexión. "
        };
        const { status } = call;
        if(status === 200) return {
            success: true,
            message: "Teléfono eliminado. "
        };
        else {
            const { error }: { error: IError } = await call.json();
            return {
                success: false,
                ...error
            };
        }
    }
    public getAPIPrefix(): string {
        return `/enterprises/${this._id}`;
    }
    public async getVotes(): Promise<VoteStatus> {
        return getVotes(this.getAPIPrefix());
    }
    public async upvote(): Promise<VoteStatus> {
        return upvote(this.getAPIPrefix());
    }
    public async downvote(): Promise<VoteStatus> {
        return downvote(this.getAPIPrefix());
    }
    public async fetchComments(paginator: IPaginator): Promise<ICommentFetchResponse> {
        return Comment.fetch(this.getAPIPrefix(), paginator);
    }
    public async postComment(content: string): Promise<ICommentCreationResponse> {
        return Comment.post(this.getAPIPrefix(), content);
    }
    public async deleteComment(comment: Comment): Promise<CommonResponse> {
        return comment.delete(this.getAPIPrefix());
    }
}