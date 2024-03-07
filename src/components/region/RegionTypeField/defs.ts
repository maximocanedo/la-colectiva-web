import {RegionType} from "../../../data/models/region";

export interface RegionRoleProps {
    id: string;
    initialValue: RegionType;
    editable: boolean;
    onUpdate(value: RegionType): void;
}