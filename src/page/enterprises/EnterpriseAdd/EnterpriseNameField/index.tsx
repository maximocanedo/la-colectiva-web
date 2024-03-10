import {Field, Input} from "@fluentui/react-components";
import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {IEnterpriseNameFieldProps} from "./defs";
import {FieldValidationStatus} from "../../../../components/user/user-page/RoleSelector/defs";

const LANG_PATH: string = "components.enterprise.EnterpriseNameField";
const strings = {
    label: "label",
    err: {
        ok: "err.ok",
        min: "err.min",
        max: "err.max"
    }
};
const EnterpriseNameField = ({ value, onChange, onCheck }: IEnterpriseNameFieldProps): React.JSX.Element => {
    const { t: translate } = useTranslation();
    const t = (key: string): string => translate(`${LANG_PATH}.${key}`);
    const [ state, setState ] = useState<FieldValidationStatus>("none");
    const [ message, setMessage ] = useState<string>("");

    useEffect(() => onCheck(state === "success"), [state]);
    const x = (s: FieldValidationStatus, m: string): void => {
        setState(s);
        setMessage(m);
    };

    const changeHandler = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const v: string = e.target.value;
        onChange(v);
        if(v.length === 0) x("none", "");
        else if(v.length < 3) x("error", t(strings.err.min));
        else if(v.length > 48) x("error", t(strings.err.max));
        else x("success", t(strings.err.ok));
    };

    return (
        <Field
            label={t(strings.label)}
            validationState={state}
            validationMessage={message}>
            <Input type={"text"} minLength={3} maxLength={48} value={value} onChange={changeHandler} />
        </Field>
    );
};
export default EnterpriseNameField;