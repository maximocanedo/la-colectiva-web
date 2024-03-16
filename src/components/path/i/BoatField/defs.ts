import {IBoat} from "../../../../data/models/boat";

export interface IBoatFieldProps {
    value: IBoat;
    onChange(value: IBoat): void;
    editable: boolean;
    id: string;
}