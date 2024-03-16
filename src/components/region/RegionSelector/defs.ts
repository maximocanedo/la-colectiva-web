import {IRegion} from "../../../data/models/region";

export interface IRegionSelectorProps {
    selected: IRegion | null;
    onSelect(selected: IRegion): void;
}