'use strict';

import { CommonResponse, IError, u } from "../utils";
import { Comment, IPaginator, ICommentFetchResponse, ICommentCreationResponse } from "./comment";
import { IEnterprise, Enterprise } from "./enterprise";
import { IUser } from "./user";
import { VoteStatus, getVotes, upvote, downvote } from "./vote";

export interface IBoat {
    _id: string;
    mat?: string;
    name?: string;
    status?: boolean;
    enterprise?: IEnterprise | Enterprise | string;
    user?: IUser | string;
    uploadDate?: Date;
    __v?: number;
}

interface IBoatCreate {
    mat: string;
    name: string;
    enterprise: string;
    status: boolean;
}

interface IBoatEdit {
    mat?: string;
    name?: string;
    enterprise?: string;
    status?: boolean;
}

export class Boat implements IBoat {
    public _id: string;
    public mat?: string;
    public name?: string;
    public status?: boolean;
    public enterprise?: IEnterprise | Enterprise | string;
    public user?: IUser | string;
    public uploadDate?: Date;
    public __v?: number;

    constructor(data: IBoat) {
        this._id = data._id;
        this.mat = data.mat;
        this.name = data.name;
        this.status = data.status;
        this.enterprise = data.enterprise;
        this.user = data.user;
        this.uploadDate = data.uploadDate;
        this.__v = data.__v;
    }

    public getAPIPrefix(): string {
        return "boats/" + this._id;
    }

    public async edit(boat: IBoatEdit): Promise<CommonResponse> {
        const call = await u.put(this.getAPIPrefix(), boat);
        if(call !== null) {
            const { status } = call;
            if(status == 200) return {
                success: true,
                message: "El barco ha sido editado con éxito."
            };
            else return {
                success: false,
                message: "El barco no se ha podido editar."
            };
        } else return {
            success: false,
            message: "El barco no se ha podido editar."
        };
    }

    public async delete(): Promise<CommonResponse> {
        const call = await u.del(this.getAPIPrefix());
        if(call !== null) {
            const { status } = call;
            if(status == 200) return {
                success: true,
                message: "El barco ha sido eliminado con éxito."
            };
            else return {
                success: false,
                message: "El barco no se ha podido eliminar."
            };
        } else return {
            success: false,
            message: "El barco no se ha podido eliminar."
        };
    }
    public static async create(boat: IBoatCreate): Promise<CommonResponse> {
        const call = await u.post("boats", boat);
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
                data: new Boat({
                    ...boat,
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

    public clone(): Boat {
        return new Boat(this);
    }
}