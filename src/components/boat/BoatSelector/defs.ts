import {IBoat} from "../../../data/models/boat";

export interface IBoatSelectorProps {
    selected: IBoat | null;
    onSelect(selected: IBoat): void;
}