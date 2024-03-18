import {ScheduleGroup} from "../../../data/models/schedules";
import {Myself} from "../../page/definitions";

export interface ISchedulePairProps extends ScheduleGroup {
    me: Myself;
    dockOrigin: { _id: string, name: string } | string;
    dockDestination: { _id: string, name: string } | string;
}