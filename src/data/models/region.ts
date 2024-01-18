'use strict';
import { u, CommonResponse, IError } from "../utils";
import { Comment, ICommentCreationResponse, ICommentFetchResponse, ICommentable, IPaginator } from "./comment";
import { IUser } from "./user";

export enum RegionType {
    RIVER = 0, // Río
    STREAM = 1, // Arroyo
    BROOK = 2, // Riachuelo
    CANAL = 3, // Canal
    LAKE = 4, // Lago
    POND = 5, // Estanque
    LAGOON = 6, // Laguna
    RESERVOIR = 7, // Embalse
    SWAMP = 8, // Pantano
    WELL = 9, // Pozo
    AQUIFER = 10, // Acuífero
    BAY = 11, // Bahía
    GULF = 12, // Golfo
    SEA = 13, // Mar
    OCEAN = 14 // Océano
};

export interface IRegion {
    _id: string;
    name: string;
    user?: string | IUser;
    type?: RegionType;
    uploadDate?: Date | string;
    __v?: number;

}

export interface IRegionCreate {
    name: string;
    type: RegionType;
}

export interface IRegionMethods {
    edit(name: string, type: RegionType): Promise<CommonResponse>;
    delete(): Promise<CommonResponse>;
}

export class Region implements IRegion, IRegionMethods, ICommentable {
    public _id: string;
    public name: string;
    public user?: string | IUser;
    public type?: RegionType;
    public uploadDate?: Date | string;
    public __v?: number;

    constructor(region: IRegion) {
        this._id = region._id;
        this.name = region.name;
        this.user = region.user;
        this.type = region.type;
        this.uploadDate = region.uploadDate;
        this.__v = region.__v;
    }

    public clone(): Region {
        return new Region(this);
    }

    async edit(name: string, type: RegionType): Promise<CommonResponse> {
        const call = await u.put("regions/" + this._id, { name, type });
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

    async delete(): Promise<CommonResponse> {
        const call = await u.del("regions/" + this._id, {});
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

    public static async create(region: IRegionCreate): Promise<CommonResponse> {
        const call = await u.post("regions", region);
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
                data: new Region({
                    ...region,
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
    public static async find(id: string): Promise<Region> {
        const call = await u.get("regions/" + id);
        if(call == null) return Promise.reject({
            code: "unknown-error",
            message: "Error de conexión. ",
            details: "No se pudo conectar con el servidor. "
        });
        const { status } = call;
        if(status === 200) {
            const data = await call.json();
            return new Region(data);
        } return Promise.reject(await call.json());
    }



    public async fetchComments(paginator: IPaginator): Promise<ICommentFetchResponse> {
        return Comment.fetch("regions/" + this._id, paginator);
    }

    public async postComment(content: string): Promise<ICommentCreationResponse> {
        return Comment.post("regions/" + this._id, content);
    }

    public async deleteComment(comment: Comment): Promise<CommonResponse> {
        return comment.delete("regions/" + this._id);
    }

}