import {IUser} from "../../../data/models/user";
import {RegionType} from "../../../data/models/region";

export interface RegionNameProps {
    name: string;
    onUpdate(name: string): void;
    author: IUser | null;
    me: IUser | null;
    id: string;
    type: RegionType;
}