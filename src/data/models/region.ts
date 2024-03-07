import { CommonResponse, IError } from "../utils";
import { IUser } from "./user";
/**
 * Tipos de regiones admitidas.
 */
export enum RegionType {
    /**
     * **Río**
     */
    RIVER = 0,
    /**
     * **Arroyo**
     */
    STREAM = 1,
    /**
     * **Riachuelo**
     */
    BROOK = 2,
    /**
     * **Canal**
     */
    CANAL = 3,
    /**
     * **Lago**
     */
    LAKE = 4,
    /**
     * **Estanque**
     */
    POND = 5,
    /**
     * **Laguna**
     */
    LAGOON = 6,
    /**
     * **Embalse**
     */
    RESERVOIR = 7,
    /**
     * **Pantano**
     */
    SWAMP = 8,
    /**
     * **Pozo**
     */
    WELL = 9,
    /**
     * **Acuífero**
     */
    AQUIFER = 10,
    /**
     * **Bahía**
     */
    BAY = 11,
    /**
     * **Golfo**
     */
    GULF = 12,
    /**
     * **Mar**
     */
    SEA = 13,
    /**
     * **Océano**
     */
    OCEAN = 14
}
export interface IRegion {
    _id: string;
    name: string;
    user?: string | IUser;
    type?: RegionType;
    active?: boolean;
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
export interface CreationResponse {
    _id: string;
    success: boolean;
    message?: string;
    error?: IError | null;
}