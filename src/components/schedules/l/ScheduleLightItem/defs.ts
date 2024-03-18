import {IScheduleView} from "../../../../data/models/schedules";

export interface IScheduleLightItemProps extends IScheduleView {
    editable: boolean;
    onUpdate(schedule: IScheduleView): void;
}