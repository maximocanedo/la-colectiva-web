import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import {IDescriptionFieldProps} from "./defs";
import {useStyles} from "./styles";
import {FieldValidationStatus} from "../../../user/user-page/RoleSelector/defs";
import {Field, Input, InputOnChangeData} from "@fluentui/react-components";

const LANG_PATH: string = "components.paths.c.DescriptionField";
const strings = {
    label: "label",
    err: {
        minlength: "err.minlength",
        maxlength: "err.maxlength"
    }
};
const DescriptionField = ({ value, onChange, onCheck }: IDescriptionFieldProps): React.JSX.Element => {
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
        const isValid: boolean = newValue.trim().length >= 3 && newValue.trim().length <= 128;
        if(newValue.trim().length < 3 && newValue.trim().length > 0)
            n(t(strings.err.minlength), "error");
        else if(newValue.trim().length > 128)
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
                maxLength={128}
                value={value}
                onChange={handler}
            />
        </Field>
    );
};
export default DescriptionField;