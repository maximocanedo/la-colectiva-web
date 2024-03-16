import {IDockMinimal} from "../../../data/actions/dock";

export interface IDockMarkerProps {
    onClick(data: IDockMinimal): void;
    data: IDockMinimal;
    map: L.Map | null;
}