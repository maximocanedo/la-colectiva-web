import {IRegion, RegionType} from "../../../data/models/region";

export interface RegionIconRepProps {
    region: IRegion | null;
    name: string;
    type: RegionType
}