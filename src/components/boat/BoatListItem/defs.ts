import {IBoat} from "../../../data/models/boat";

export interface IBoatListItemProps extends IBoat {
    onClick(data: IBoat): void;
}