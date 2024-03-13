import {IBoat} from "../../../data/models/boat";

export interface IBoatListProps {
    data: IBoat[];
    onClick(data: IBoat): void;
}