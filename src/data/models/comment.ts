'use strict';
import { u, CommonResponse } from "../utils";
import { IUser } from "./user";

export interface IComment {
    _id: string;
    user: IUser | string;
    content: string;
    active: boolean;
    uploadDate: Date;
    __v: number; 
}

export interface IPaginator {
    p: number;
    itemsPerPage: number;
}

export interface ICommentCreate {
    content: string;
}

export interface ICommentFetchResponse {
    success: boolean;
    comments: IComment[];
    message: string;
}

export interface ICommentCreationResponse {
    success: boolean;
    comment: any[] | Comment;
    message: string;
}

export class Comment implements IComment {
    public _id: string;
    public user: IUser | string;
    public content: string;
    public active: boolean;
    public uploadDate: Date;
    public __v: number;

    constructor(comment: IComment) {
        this._id = comment._id;
        this.user = comment.user;
        this.content = comment.content;
        this.active = comment.active;
        this.uploadDate = comment.uploadDate;
        this.__v = comment.__v;
    }

    public async edit(content: string): Promise<CommonResponse> {
        const call = await u.put("comments/" + this._id, { content });
        if(call !== null) {
            const { status } = call;
            const data = await call.json();
            if(status === 200) {
                this.content = data.content;
                this.uploadDate = data.uploadDate;
                this.__v = data.__v;
                this.active = data.active;
                return {
                    success: true,
                    message: "Comentario editado con éxito. "
                };
            } else {
                return {
                    success: false,
                    ...data
                };
            }
        }
        return {
            success: false,
            message: "Error de conexión. "
        };
    }

    public async delete(API: string): Promise<CommonResponse> {
        const call = await u.del(API + "/comments/" + this._id, {});
        if(call !== null) {
            const { status } = call;
            const data = await call.json();
            if(status === 200) {
                this.active = false;
                return {
                    success: true,
                    message: "Comentario eliminado con éxito. "
                };
            } else {
                return {
                    success: false,
                    ...data
                };
            }
        }
        return {
            success: false,
            message: "Error de conexión. "
        };
    }

    public static async post(API: string, content: string): Promise<ICommentCreationResponse> {
        const call = await u.post(API + "/comments", { content });
        if(call != null) {
            const { status } = call;
            const data = await call.json();
            return {
                ...data,
                success: status === 201
            }
        } return {
            success: false,
            comment: [],
            message: ""
        }
    }

    public static async get(API: string, paginator: IPaginator): Promise<ICommentFetchResponse> {
        const call = await u.get(API + "/comments");
        if(call != null) {
            const { status } = call;
            const data = await call.json();
            if(status === 200) return {
                success: true,
                comments: data,
                message: ""
            }; return {
                success: false,
                comments: [],
                message: ""
            }
        } return {
            success: false,
            comments: [],
            message: ""
        };
    }


}