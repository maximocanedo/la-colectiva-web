import { IDock } from "./dock";
import { IPath } from "./path";
import { IUser } from "./user";

export interface ISchedule {
    path: IPath,
    dock: IDock,
    time: Date,
    user: IUser | string,
    active: boolean
}
export interface IScheduleLight {
    _id: string,
    path: string,
    dock: string,
    time: string,
    user?: string,
    uploadDate?: Date | string,
    active?: boolean,
    __v?: number
}
export interface IScheduleCreate {
    dock: string;
    time: string;
    path: string;
}
export interface IScheduleEdit {
    dock?: string;
    time?: string;
    path?: string;
}