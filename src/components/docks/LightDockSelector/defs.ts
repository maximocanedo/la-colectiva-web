import {DockPropertyStatus, IDockView} from "../../../data/models/dock";

export type D = { _id: string, name: string, status: DockPropertyStatus };
export interface ILightDockSelectorProps {
    placeholder?: string;
    value:D | null;
    onChange(value:D | null): void;
    langPath: string;
}