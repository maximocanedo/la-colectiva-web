import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import {IScreenProps} from "./defs";
import {useStyles} from "./styles";
import {mergeClasses, Subtitle2, Title3} from "@fluentui/react-components";

const LANG_PATH: string = "components.Screen";
const strings = {};
const Screen = ({ title, description, icon }: IScreenProps): React.JSX.Element => {
    const {t: translate} = useTranslation();
    const t = (key: string): string => translate(LANG_PATH + "." + key);
    const styles = useStyles();

    return (<center className={mergeClasses(styles.root, "_screen")}>
        { icon }
        <Subtitle2>{ title }</Subtitle2>
        <p>{ description }</p>
    </center>);
};
export default Screen;