import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import {IStatusFieldProps} from "./defs";
import {useStyles} from "./styles";
import {Field, Input} from "@fluentui/react-components";
import {FieldValidationStatus} from "../../../user/user-page/RoleSelector/defs";
import {DockPropertyStatus} from "../../../../data/models/dock";
import StatusField from "../../i/StatusField";

const LANG_PATH: string = "components.docks.c.StatusSelField";
const strings = {
    label: "label",
    noValid: "noValid"
};
const StatusSelField = ({ value, onChange, onCheck }: IStatusFieldProps): React.JSX.Element => {
    const {t: translate} = useTranslation();
    const t = (key: string): string => translate(LANG_PATH + "." + key);
    const styles = useStyles();

    const [ message, setMessage ] = useState<string>("");
    const [ state, setState ] = useState<FieldValidationStatus>("none");

    const changeEv = (newValue: DockPropertyStatus): void => {
        onChange(newValue);
        onCheck(newValue !== null && newValue !== undefined);
    };

    return (
        <Field
            label={t(strings.label)}
            className={styles.root}
            validationMessage={message}
            validationState={state}>
            <StatusField value={value} onChange={changeEv} />
        </Field>
    );
};
export default StatusSelField;