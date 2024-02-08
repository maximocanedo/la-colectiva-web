import { IBoat } from "./boat";
import { IUser } from "./user";

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
export interface IPathCreate {
    boat: string;
    title: string;
    description: string;
    notes: string;
}

export interface IAvailabilityCreate {
    path: string;
    condition: AvailabilityCondition;
    available: boolean;
}

export interface IPathEdit {
    boat?: string;
    title?: string;
    description?: string;
    notes?: string;
}
export interface IAvailability {
    _id: string,
    path: IPath | string,
    condition: AvailabilityCondition,
    available: boolean,
    user?: IUser,
    uploadDate?: Date,
    active?: boolean,
    __v?: number
}