import {Field, Input, InputOnChangeData} from "@fluentui/react-components";
import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import {ITitleFieldProps} from "./defs";
import {useStyles} from "./styles";
import {FieldValidationStatus} from "../../../user/user-page/RoleSelector/defs";

const LANG_PATH: string = "components.paths.c.TitleField";
const strings = {
    label: "label",
    err: {
        minlength: "err.minlength",
        maxlength: "err.maxlength"
    }
};
const TitleField = ({ value, onChange, onCheck }: ITitleFieldProps): React.JSX.Element => {
    const {t: translate} = useTranslation();
    const t = (key: string): string => translate(LANG_PATH + "." + key);
    const styles = useStyles();

    const [ message, setMessage ] = useState<string>("");
    const [ state, setState ] = useState<FieldValidationStatus>("none");
    const n = (m: string, s: FieldValidationStatus): void => {
        setMessage(m);
        setState(s);
    };
    const handler = (_e: any, d: InputOnChangeData): void => {
        const newValue: string = d.value as string;
        onChange(newValue);
        const isValid: boolean = newValue.trim().length >= 3 && newValue.trim().length <= 48;
        if(newValue.trim().length < 3 && newValue.trim().length > 0)
            n(t(strings.err.minlength), "error");
        else if(newValue.trim().length > 48)
            n(t(strings.err.maxlength), "error");
        else n("", "none");
        onCheck(isValid);
    };

    return (
        <Field
            label={t(strings.label)}
            validationMessage={message}
            validationState={state}
            className={styles.root}>
            <Input
                type={"text"}
                minLength={3}
                maxLength={48}
                value={value}
                onChange={handler}
            />
        </Field>
    );
};
export default TitleField;