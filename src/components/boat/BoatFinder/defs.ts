import {IBoat} from "../../../data/models/boat";

export interface IBoatFinderProps {
    creatable: boolean;
    onSelect(boat: IBoat): void;
}