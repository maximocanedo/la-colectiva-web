import {CommonResponse} from "../../../data/utils";
import {IUser} from "../../../data/models/user";
import {IHistoryEvent} from "../../../data/models/IHistoryEvent";
export interface IUserMinimal {
    _id: string;
    username: string;
    name: string;
}
export interface IHistoryEventProps extends IHistoryEvent {
}