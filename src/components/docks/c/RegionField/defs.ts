import {IRegion} from "../../../../data/models/region";

export interface IRegionFieldProps {
    value: IRegion | null;
    onChange(value: IRegion | null): void;
    onCheck(isValid: boolean): void;
}