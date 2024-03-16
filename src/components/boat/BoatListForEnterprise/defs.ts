import { IBoat } from "../../../data/models/boat";

export interface IBoatListForEnterpriseProps {
    enterprise: string;
    onClick(data: IBoat): void;
}