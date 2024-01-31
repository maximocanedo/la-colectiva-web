'use strict';

import { Boat, IBoat } from "./boat";
import { IUser } from "./user";
import { getVotes, upvote, downvote, VoteStatus } from "./vote";
import { Comment, ICommentFetchResponse, ICommentCreationResponse, IPaginator } from "./comment";
import { CommonResponse, IError, u } from "../utils";

export enum AvailabilityCondition {
    MONDAY = "MONDAY",
    TUESDAY = "TUESDAY",
    WEDNESDAY = "WEDNESDAY",
    THURSDAY = "THURSDAY",
    FRIDAY = "FRIDAY",
    SATURDAY = "SATURDAY",
    SUNDAY = "SUNDAY",
    HOLIDAY = "HOLIDAY"
}

export interface IPath {
    _id: string;
    boat?: IBoat | string;
    user?: IUser | string;
    title?: string;
    description?: string;
    notes?: string;
    uploadDate?: Date;
    active?: boolean;
    __v?: number;
}
interface IPathCreate {
    boat: string;
    title: string;
    description: string;
    notes: string;
}

interface IAvailabilityCreate {
    path?: string;
    condition: AvailabilityCondition;
    available: boolean;
}

interface IPathEdit {
    boat?: string;
    title?: string;
    description?: string;
    notes?: string;
}
interface IAvailability {
    _id: string,
    path: IPath,
    condition: AvailabilityCondition,
    available: boolean,
    user: IUser,
    uploadDate: Date,
    active: boolean,
    __v: number
}

export class Path implements IPath {
    public readonly _id: string;
    public boat?: IBoat | string;
    public user?: IUser | string;
    public title?: string;
    public description?: string;
    public notes?: string;
    public uploadDate?: Date;
    public active?: boolean;
    public __v?: number;
    constructor(data: IPath) {
        this._id = data._id;
        this.boat = data.boat;
        this.user = data.user;
        this.title = data.title;
        this.description = data.description;
        this.notes = data.notes;
        this.uploadDate = data.uploadDate;
        this.active = data.active;
        this.__v = data.__v;
    }
    public getAPIPrefix(): string {
        return "paths/" + this._id;
    }
    public static async create(data: IPathCreate): Promise<CommonResponse> {
        const call = await u.post("paths", data);
        if(call === null) {
            return {
                success: false,
                message: "Error de conexión"
            };
        } 
        const { status } = call;
        const res = await call.json();
        if(status == 201) {
            return {
                success: true,
                message: "Creación exitosa. ",
                data: new Path({
                    ...data,
                    boat: new Boat({ _id: data.boat }),
                    _id: res._id,
                })
            };
        } else {
            const { error }: { error: IError } = await call.json();
            return {
                success: false,
                ...error
            };
        }
    }
    public async edit(data: IPathEdit): Promise<CommonResponse> {
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

    public async addAvailability(availability: IAvailabilityCreate): Promise<CommonResponse> {
        const data = {
            ...availability,
            path: this._id
        };
        const call = await u.post("availabilities/", data);
        if(call == null) return {
            success: false,
            message: "Error de conexión. "
        };
        const { status } = call;
        if(status === 201) {
            const { _id } = await call.json();
            return {
                success: true,
                message: "Creación exitosa. ",
                data: {
                    _id,
                    ...availability
                }
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
    public async removeAvailability(availabilityId: string): Promise<CommonResponse> {
        const call = await u.del("availabilities/" + availabilityId, {});
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
    public async getAvailability(availabilityId: string): Promise<IAvailability | null> {
        const call = await u.get("availabilities/" + availabilityId);
        if(call == null) return null;
        const { status } = call;
        if(status === 200) {
            const data = await call.json();
            return data;
        } else return null;
    }

    public clone(): Path {
        return new Path(this);
    }

    public static async getById(id: string): Promise<Path | null> {
        const call = await u.get("paths/" + id);
        if(call == null) return null;
        const { status } = call;
        if(status === 200) {
            const data = await call.json();
            return new Path(data);
        } else return null;
    }
    public static async getAll(): Promise<Path[]> {
        const call = await u.get("paths");
        if(call == null) return [];
        const { status } = call;
        if(status === 200) {
            const data = await call.json();
            return data.map((path: IPath) => new Path(path));
        } else return [];
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