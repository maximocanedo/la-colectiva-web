import {IBoat} from "../../../../data/models/boat";

export interface IBoatFieldProps {
    value: IBoat | null;
    onChange(value: IBoat | null): void;
    onCheck(isValid: boolean): void;
}