import {ExampleTab} from "../OverflowMenuItem/defs";

export interface OverflowMenuProps {
    onTabSelect?: (tabId: string) => void;
    tabs: ExampleTab[];
}