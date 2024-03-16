import {IRegion} from "../../../../data/models/region";

export interface IRegionFieldProps {
    editable: boolean;
    value: IRegion;
    onChange(value: IRegion): void;
    id: string;
}