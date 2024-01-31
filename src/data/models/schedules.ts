'use strict';
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