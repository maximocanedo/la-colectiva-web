import {
    Button,
    makeStyles,
    Menu,
    MenuList,
    MenuPopover,
    MenuTrigger,
    tokens,
    useOverflowMenu
} from "@fluentui/react-components";
import React from "react";
import {OverflowMenuProps} from "./defs";
import OverflowMenuItem from "../OverflowMenuItem";
import {bundleIcon, FluentIcon, MoreHorizontalFilled, MoreHorizontalRegular} from "@fluentui/react-icons";






const MoreHorizontal: FluentIcon = bundleIcon(MoreHorizontalFilled, MoreHorizontalRegular);
const useOverflowMenuStyles = makeStyles({
    menu: {
        backgroundColor: tokens.colorNeutralBackground1,
    },
    menuButton: {
        alignSelf: "center",
    },
});
const OverflowMenu = (props: OverflowMenuProps): React.JSX.Element => {
    const { onTabSelect, tabs }: OverflowMenuProps = props;
    const { ref, isOverflowing, overflowCount } =
        useOverflowMenu<HTMLButtonElement>();

    const styles = useOverflowMenuStyles();

    const onItemClick = (tabId: string) => {
        onTabSelect?.(tabId);
    };

    if (!isOverflowing) {
        return <></>;
    }

    return (
        <Menu hasIcons>
            <MenuTrigger disableButtonEnhancement>
                <Button
                    appearance="transparent"
                    className={styles.menuButton}
                    ref={ref}
                    icon={<MoreHorizontal />}
                    aria-label={`${overflowCount} more tabs`}
                    role="tab"
                />
            </MenuTrigger>
            <MenuPopover>
                <MenuList className={styles.menu}>
                    {tabs.map((tab) => (
                        <OverflowMenuItem
                            key={tab.id}
                            tab={tab}
                            onClick={() => onItemClick(tab.id)}
                        />
                    ))}
                </MenuList>
            </MenuPopover>
        </Menu>
    );
};
export default OverflowMenu;