import {MenuItem, useIsOverflowItemVisible} from "@fluentui/react-components";
import {OverflowMenuItemProps} from "./defs";

const OverflowMenuItem = (props: OverflowMenuItemProps) => {
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