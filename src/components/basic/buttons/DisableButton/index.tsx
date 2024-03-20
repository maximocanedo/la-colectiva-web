import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import {IDisableButtonProps} from "./defs";
import {useStyles} from "./styles";
import {Button} from "@fluentui/react-components";

const LANG_PATH: string = "components.DisableButton";
const strings = {};
const DisableButton = ({ onClick, status }: IDisableButtonProps): React.JSX.Element => {
    const {t: translate} = useTranslation();
    const t = (key: string): string => translate(LANG_PATH + "." + key);
    const styles = useStyles();

    return (<Button
        className={status ? styles.disableBtn : styles.enableBtn}
        onClick={(_e): void => onClick()}
        appearance={"secondary"}>
        {status ? translate("actions.disable") : translate("actions.enable")}
    </Button>);
};
export default DisableButton;