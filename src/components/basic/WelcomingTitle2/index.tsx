import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import {IWelcomingTitle2Props} from "./defs";
import {useStyles} from "./styles";
import {mergeClasses, Title1} from "@fluentui/react-components";

const LANG_PATH: string = "components.WelcomingTitle2";
const strings = {};
const WelcomingTitle2 = ({content}: IWelcomingTitle2Props): React.JSX.Element => {
    const {t: translate} = useTranslation();
    const t = (key: string): string => translate(LANG_PATH + "." + key);
    const styles = useStyles();

    return (<div className={mergeClasses(styles.root, "welcoming-title t2")}>
        <Title1>{content}</Title1>
    </div>);
};
export default WelcomingTitle2;