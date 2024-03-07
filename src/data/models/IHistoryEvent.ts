import {IUser, Role} from "./user";

export interface IHistoryEvent {
    content: string;
    time: Date;
    user: {
        _id: string;
        name: string;
        role: Role;
        active: true;
    } & IUser,
    _id: string;
}