import {DockPropertyStatus} from "../../../data/models/dock";

type SelectableDock = { _id: string, name: string, status: DockPropertyStatus } | null;
export interface ITripSelectorProps {
    from: SelectableDock;
    dest: SelectableDock;
    onFromChange(val: SelectableDock): void;
    onDestinationChange(val: SelectableDock): void;
}