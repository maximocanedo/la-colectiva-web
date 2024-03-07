import {MenuItemProps} from "@fluentui/react-components";

export type ExampleTab = {
    id: string;
    name: string;
    icon: React.ReactElement;
};
export type OverflowMenuItemProps = {
    tab: ExampleTab;
    onClick: MenuItemProps["onClick"];
};