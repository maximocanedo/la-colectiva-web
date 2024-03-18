import { IDock } from "./dock";
import {AvailabilityCondition, IPath} from "./path";
import { IUser } from "./user";

export interface ISchedule {
    path: IPath,
    dock: IDock,
    time: Date,
    user: IUser | string,
    active: boolean
}
export interface IScheduleView {
    _id: string;
    path: IPath;
    dock: IDock;
    user: IUser;
    uploadDate: Date | string;
    active: boolean;
    time: string;
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
export interface ScheduleGroup {
    _id: string;
    schedules: IScheduleLight[],
    path: {
        boat: {
            _id: string;
            mat: string;
            name: string;
            status: boolean;
        };
        title: string;
        description: string;
    };
    enterprise: {
        _id: string;
        cuit: number;
        name: string;
    },
    duration: number;
    available: AvailabilityCondition[]
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