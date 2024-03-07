import React from "react";
import {TabHandlerProps, tabHandlerStyles} from "./defs";
import {mergeClasses, Overflow, OverflowItem, Tab, TabList} from "@fluentui/react-components";
import OverflowMenu from "../OverflowMenu";

const TabHandler = ({ tab, onTabSelect, tabs, minimumVisible }: TabHandlerProps): React.JSX.Element => {
    const styles = tabHandlerStyles();


    return <div className={mergeClasses(styles.example, styles.horizontal)}>
        <Overflow minimumVisible={minimumVisible}>
            <TabList
                selectedValue={tab}
                onTabSelect={(_, d) => onTabSelect(d.value as string)}
            >
                {tabs.map((tabObj) => {
                    return (
                        <OverflowItem
                            key={tabObj.id}
                            id={tabObj.id}
                            priority={tabObj.id === tab ? 2 : 1}
                        >
                            <Tab value={tabObj.id} icon={<span>{tabObj.icon}</span>}>
                                {tabObj.name}
                            </Tab>
                        </OverflowItem>
                    );
                })}
                <OverflowMenu tabs={tabs} onTabSelect={onTabSelect}/>
            </TabList>
        </Overflow>
    </div>
};
export default TabHandler;