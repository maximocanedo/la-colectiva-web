import {RecordCategory} from "../../../data/actions/reports";
import {Myself} from "../../page/definitions";

export interface IReportDialogProps {
    id: string;
    open: boolean;
    type: RecordCategory;
    close(): void;
    me: Myself;
}