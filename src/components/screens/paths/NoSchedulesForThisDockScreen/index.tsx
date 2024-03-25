import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import {INoSchedulesForThisDockScreenProps} from "./defs";
import {useStyles} from "./styles";
import Screen from "../../Screen";
import {TimerOffRegular} from "@fluentui/react-icons";

const LANG_PATH: string = "screens.NoSchedulesForThisDockScreen";
const strings = {};
const NoSchedulesForThisDockScreen = ({}: INoSchedulesForThisDockScreenProps): React.JSX.Element => {
    const {t: translate} = useTranslation();
    const t = (key: string): string => translate(LANG_PATH + "." + key);
    const styles = useStyles();

    return (<Screen
        title={t("title")}
        description={t("description")}
    />);
};
export default NoSchedulesForThisDockScreen;