import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import {IWelcomingTitleProps} from "./defs";
import {useStyles} from "./styles";
import {mergeClasses, Title1} from "@fluentui/react-components";

const LANG_PATH: string = "components.WelcomingTitle";
const strings = {};
const WelcomingTitle = ({ content }: IWelcomingTitleProps): React.JSX.Element => {
    const {t: translate} = useTranslation();
    const t = (key: string): string => translate(LANG_PATH + "." + key);
    const styles = useStyles();

    return (<div className={mergeClasses(styles.root, "welcoming-title")}>
        <Title1>{content}</Title1>
    </div>);
};
export default WelcomingTitle;