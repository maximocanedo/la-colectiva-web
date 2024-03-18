import {IDockMinimal} from "../../../data/actions/dock";
import {IScheduleView} from "../../../data/models/schedules";

export interface IDockMarkerProps {
    onClick(data: IDockMinimal, schedules: IScheduleView[]): void;
    data: IDockMinimal;
    map: L.Map | null;
    schedules(dock: string): IScheduleView[];
}