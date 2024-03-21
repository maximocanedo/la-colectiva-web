import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import {ILoadTriggerButtonProps} from "./defs";
import {useStyles} from "./styles";
import {Button, mergeClasses, Spinner} from "@fluentui/react-components";
import {ArrowDownloadRegular, ArrowSyncRegular, ChevronDownRegular} from "@fluentui/react-icons";

const LANG_PATH: string = "components.LoadTriggerButton";
const strings = {};
const LoadTriggerButton = ({ state, onClick }: ILoadTriggerButtonProps): React.JSX.Element => {
    const {t: translate} = useTranslation();
    const t = (key: string): string => translate(LANG_PATH + "." + key);
    const styles = useStyles();

    const icon = (state === "loading" && <Spinner size={"extra-tiny"} />)
        || (state === "loaded" && <ChevronDownRegular />)
        || (state === "no-data" && <ArrowSyncRegular />)
        || (state === "err" && <ArrowSyncRegular />)
        || (state === "initial" && <ArrowDownloadRegular />)
        || null;

    return (<center className={mergeClasses(styles.root, "loadMoreBtn")}>
        <Button
            appearance={"outline"}
            {...{ icon, onClick }}
            iconPosition={"before"}>
        </Button>
    </center>);
};
export default LoadTriggerButton;