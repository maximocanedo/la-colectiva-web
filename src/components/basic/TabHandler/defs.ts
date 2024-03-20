import {makeStyles, shorthands, tokens} from "@fluentui/react-components";
export type TabData = {
    id: string;
    name: string;
    icon: React.ReactElement;
};
export type TabHandlerProps = {
    tabs: TabData[];
    onTabSelect(id: string): void;
    tab: string;
    minimumVisible: number;
}
export const tabHandlerStyles = makeStyles({
    example: {
        ...shorthands.overflow("hidden"),
        backgroundColor: tokens.colorNeutralBackground2,
        ...shorthands.borderBottom("1px", "solid", tokens.colorNeutralBackground2Pressed),
        zIndex: 0, //stop the browser resize handle from piercing the overflow menu
    },
    horizontal: {
        height: "fit-content",
        minWidth: "150px",
        width: "100%",
    },
    vertical: {
        height: "250px",
        minHeight: "100px",
        resize: "vertical",
        width: "fit-content",
        display: "flex",
        alignContent: "stretch",
        alignItems: "stretch",
        justifyContent: "stretch",
        justifyItems: "stretch",
    },
});