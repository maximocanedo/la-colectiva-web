import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import {IStatusFieldProps} from "./defs";
import {useStyles} from "./styles";
import {Combobox, Option} from "@fluentui/react-components";
import {DockPropertyStatus} from "../../../../data/models/dock";

const LANG_PATH: string = "components.StatusField";
const strings = {};
const StatusField = ({ value, onChange }: IStatusFieldProps): React.JSX.Element => {
    const {t: translate} = useTranslation();
    const t = (key: string): string => translate(LANG_PATH + "." + key);
    const styles = useStyles();

    const text: string[] = [
        "private",
        "public",
        "business",
        "government",
        "neighbourhood",
        "other",
        "unlisted"
    ];
    const gt = (i: DockPropertyStatus): string => translate(`dockStatus.${text[i]}`);

    return (<Combobox
        selectedOptions={[value + ""]}
        value={gt(value)}
        onOptionSelect={(e,d) => {
            onChange(parseInt(d.optionValue?? "6"));
        }}
        className={styles.root}>
        {text.map((str, i) => <Option value={i + ""}>{gt(i)}</Option>)}
    </Combobox>);
};
export default StatusField;