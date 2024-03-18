import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import {IScheduleItemProps} from "./defs";
import {useStyles} from "./styles";
import {Caption1, Card, CardHeader, Link, mergeClasses, Subtitle2Stronger} from "@fluentui/react-components";

const LANG_PATH: string = "components.ScheduleItem";
const strings = {};
const ScheduleItem = ({ _id, time, dock }: IScheduleItemProps): React.JSX.Element => {
    const {t: translate} = useTranslation();
    const t = (key: string): string => translate(LANG_PATH + "." + key);
    const styles = useStyles();

    return (<Card appearance={"outline"} className={mergeClasses(styles.root, "sch_item")}>
        <CardHeader
            header={<Subtitle2Stronger>{time}</Subtitle2Stronger>}
            description={<Caption1><Link href={"/docks/" + dock._id}>{dock.name}</Link></Caption1>}
        />
    </Card>);
};
export default ScheduleItem;