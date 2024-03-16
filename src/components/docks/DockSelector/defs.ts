import {IDockMinimal} from "../../../data/actions/dock";
import {DockPropertyStatus} from "../../../data/models/dock";

export interface IDockSelectorProps {
    showAddButton?: boolean;
    query?: string;
    status?: DockPropertyStatus | -1;
    onClick(dock: IDockMinimal): void;
}