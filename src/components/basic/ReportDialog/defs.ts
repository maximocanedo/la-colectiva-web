import {RecordCategory} from "../../../data/actions/reports";

export interface IReportDialogProps {
    id: string;
    open: boolean;
    type: RecordCategory;
    close(): void;
}