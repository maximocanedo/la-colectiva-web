'use strict';
import { CommonResponse, IError, u } from "../utils";
import { ICommentCreationResponse, ICommentFetchResponse, IPaginator, Comment } from "./comment";
import { IRegion, Region } from "./region";
import { IUser } from "./user";
import { getVotes, upvote, downvote, VoteStatus, VoteType } from "./vote";

enum DockPropertyStatus {
    /**
     * Muelle de uso privado. 
     */
    PRIVATE = 0,
    /**
     * Muelle de uso público.
     */
    PUBLIC = 1,
    /**
     * Muelle de uso comercial. 
     */
    BUSINESS = 2,
    /**
     * Muelle de uso gubernamental.
     */
    GOVERNMENT = 3,
    /**
     * Otro tipo de muelle.
     */
    OTHER = 4,
    /**
     * Se desconoce el tipo de muelle. 
     */
    UNLISTED = 5
};

interface IDock {
    _id: string;
    name: string;
    address: number;
    region: IRegion;
    notes: string;
    status: DockPropertyStatus;
    user?: IUser;
    uploadDate?: Date;
    active?: boolean;
    coordinates: [number, number];
    pictures?: [string];
    __v?: number;
}

interface IDockEdit {
    name: string;
    address: number;
    region: string;
    notes: string;
    coordinates: [number, number];
}

interface IDockCreate {
    name: string;
    address: number;
    region: string;
    notes: string;
    status: DockPropertyStatus;
    coordinates: [number, number];
}

export class Dock implements IDock {
    public _id: string;
    public name: string;
    public address: number;
    public region: IRegion;
    public notes: string;
    public status: DockPropertyStatus;
    public user?: IUser;
    public uploadDate?: Date;
    public active?: boolean;
    public coordinates: [number, number];
    public pictures?: [string];
    public __v?: number;

    constructor(data: IDock) {
        this._id = data._id;
        this.name = data.name;
        this.address = data.address;
        this.region = data.region;
        this.notes = data.notes;
        this.status = data.status;
        this.user = data.user;
        this.uploadDate = data.uploadDate;
        this.active = data.active;
        this.coordinates = data.coordinates;
        this.pictures = data.pictures;
        this.__v = data.__v;
    }

    
    public async edit(data: IDockEdit): Promise<CommonResponse> {
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
    public static async create(dock: IDockCreate): Promise<CommonResponse> {
        const call = await u.post("docks", dock);
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
                data: new Dock({
                    name: dock.name,
                    address: dock.address,
                    region: new Region({ _id: dock.region, name: "" }),
                    notes: dock.notes,
                    status: dock.status, 
                    coordinates: dock.coordinates,
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
    public static async find(id: string): Promise<Dock> {
        const call = await u.get("docks/" + id);
        if(call == null) return Promise.reject({
            code: "unknown-error",
            message: "Error de conexión. ",
            details: "No se pudo conectar con el servidor. "
        });
        const { status } = call;
        if(status === 200) {
            const data = await call.json();
            return new Dock(data);
        } return Promise.reject(await call.json());
    }
    public static async list(): Promise<Dock[]> {
        const call = await u.get("regions");
        if(call == null) return Promise.reject({
            code: "unknown-error",
            message: "Error de conexión. ",
            details: "No se pudo conectar con el servidor. "
        });
        const { status } = call;
        if(status === 200) {
            const data = await call.json();
            return data.map((data: IDock) => new Dock(data));
        } return Promise.reject(await call.json());
    }

    public getAPIPrefix(): string {
        return `/docks/${this._id}`;
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