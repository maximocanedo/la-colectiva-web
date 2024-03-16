import {IAvailability} from "../../../data/models/path";
import {Myself} from "../../page/definitions";

export interface IAvailabilityItemProps extends IAvailability {
    me: Myself;
    editable: boolean;
}