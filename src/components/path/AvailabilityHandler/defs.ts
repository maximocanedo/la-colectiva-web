import {Myself} from "../../page/definitions";
import {AvailabilityCondition} from "../../../data/models/path";

export interface IAvailabilityHandlerProps {
    id: string;
    editable: boolean;
    me: Myself;
}
export const tcn = (i: AvailabilityCondition): string => {
    switch(i) {
        case AvailabilityCondition.MONDAY: return "av.monday";
        case AvailabilityCondition.TUESDAY: return "av.tuesday";
        case AvailabilityCondition.WEDNESDAY: return "av.wednesday";
        case AvailabilityCondition.THURSDAY: return "av.thursday";
        case AvailabilityCondition.FRIDAY: return "av.friday";
        case AvailabilityCondition.SATURDAY: return "av.saturday";
        case AvailabilityCondition.SUNDAY: return "av.sunday";
        case AvailabilityCondition.HOLIDAY: return "av.holiday";
        default: return "";
    }
};
export const tct = (i: AvailabilityCondition): string => {
    switch(i) {
        case AvailabilityCondition.MONDAY: return "MONDAY";
        case AvailabilityCondition.TUESDAY: return "TUESDAY";
        case AvailabilityCondition.WEDNESDAY: return "WEDNESDAY";
        case AvailabilityCondition.THURSDAY: return "THURSDAY";
        case AvailabilityCondition.FRIDAY: return "FRIDAY";
        case AvailabilityCondition.SATURDAY: return "SATURDAY";
        case AvailabilityCondition.SUNDAY: return "SUNDAY";
        case AvailabilityCondition.HOLIDAY: return "HOLIDAY";
        default: return "";
    }
};
export const nct = (i: string): AvailabilityCondition => {
    switch(i) {
        case "MONDAY": return AvailabilityCondition.MONDAY;
        case "TUESDAY": return AvailabilityCondition.TUESDAY;
        case "WEDNESDAY": return AvailabilityCondition.WEDNESDAY;
        case "THURSDAY": return AvailabilityCondition.THURSDAY;
        case "FRIDAY": return AvailabilityCondition.FRIDAY;
        case "SATURDAY": return AvailabilityCondition.SATURDAY;
        case "SUNDAY": return AvailabilityCondition.SUNDAY;
        case "HOLIDAY": return AvailabilityCondition.HOLIDAY;
        default: {
            throw new Error("Invalid input");
        }
    }
};