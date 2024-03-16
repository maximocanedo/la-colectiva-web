import {DockPropertyStatus} from "../../../../data/models/dock";

export interface IStatusModifiableFieldProps {
    value: DockPropertyStatus;
    onUpdate(value: DockPropertyStatus): void;
    editable: boolean;
    id: string;
}