import {MenuItem, useIsOverflowItemVisible} from "@fluentui/react-components";
import {OverflowMenuItemProps} from "./defs";
import {log} from "../../page/definitions";

const OverflowMenuItem = (props: OverflowMenuItemProps) => {
    log("OverflowMenuItem");
    const { tab, onClick } = props;
    const isVisible = useIsOverflowItemVisible(tab.id);

    if (isVisible) {
        return null;
    }

    return (
        <MenuItem key={tab.id} icon={tab.icon} onClick={onClick}>
            <div>{tab.name}</div>
        </MenuItem>
    );
};
export default OverflowMenuItem;