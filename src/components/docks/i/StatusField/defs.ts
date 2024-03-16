import {DockPropertyStatus} from "../../../../data/models/dock";

export interface IStatusFieldProps {
    value: DockPropertyStatus;
    onChange(value: DockPropertyStatus): void;
}