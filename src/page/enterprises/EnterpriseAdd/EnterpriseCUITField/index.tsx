import {Field, Input} from "@fluentui/react-components";
import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {IEnterpriseCUITFieldProps} from "./defs";
import {FieldValidationStatus} from "../../../../components/user/user-page/RoleSelector/defs";
import * as enterprises from "../../../../data/actions/enterprise";
const LANG_PATH: string = "components.enterprise.EnterpriseCUITField";
const strings = {
    label: "label",
    err: {
        min: "err.min",
        max: "err.max"
    }
};
const EnterpriseCUITField = ({ value, onChange, onCheck }: IEnterpriseCUITFieldProps): React.JSX.Element => {
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
        const v: number = parseInt(e.target.value);
        onChange(v);
        if(e.target.value.length === 0) x("none", "");
        else if(v < 1000) x("error", t(strings.err.min));
        else if(v > 999999999999) x("error", t(strings.err.max));
        else x("success", enterprises.formatCUIT(v));
    };

    return (
        <Field
            label={t(strings.label)}
            validationState={state}
            validationMessage={message}>
            <Input type={"number"} min={1000} max={999999999999} value={value + ""} onChange={changeHandler} />
        </Field>
    );
};
export default EnterpriseCUITField;