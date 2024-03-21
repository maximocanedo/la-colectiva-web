import {IRegion} from "../../../data/models/region";

export interface IRegionFinderProps {
    creatable: boolean;
    onSelect(data: IRegion): void;
    icon?: React.JSX.Element | null;
}