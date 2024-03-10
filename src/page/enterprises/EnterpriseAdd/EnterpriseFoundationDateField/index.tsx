import {Field, InputOnChangeData, Textarea, TextareaOnChangeData} from "@fluentui/react-components";
import React, {ChangeEvent, useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {IEnterpriseFoundationDateFieldProps} from "./defs";
import {FieldValidationStatus} from "../../../../components/user/user-page/RoleSelector/defs";
import {DatePicker} from "@fluentui/react-datepicker-compat";

const LANG_PATH: string = "components.enterprise.EnterpriseFoundationDateField";
const strings = {
    label: "label",
    err: {
        future: "err.future",
        invalid: "err.invalid"
    }
};
const EnterpriseFoundationDateField = ({ value, onChange, onCheck }: IEnterpriseFoundationDateFieldProps): React.JSX.Element => {
    const { t: translate } = useTranslation();
    const t = (key: string): string => translate(`${LANG_PATH}.${key}`);
    const [ state, setState ] = useState<FieldValidationStatus>("none");
    const [ message, setMessage ] = useState<string>("");

    useEffect(() => onCheck(state === "success"), [state]);
    const x = (s: FieldValidationStatus, m: string): void => {
        setState(s);
        setMessage(m);
    };

    const changeHandler = (v: Date | null | undefined): void => {
        if(v === null || v === undefined) x("error", t(strings.err.invalid));
        else if(new Date(v).getTime() > new Date(Date.now()).getTime()) {
            x("error", t(strings.err.future));
            return;
        }
        else x("success", "");
        onChange(new Date(v as Date));
    };

    return (
        <Field
            label={t(strings.label)}
            validationState={state}
            validationMessage={message}>
            <DatePicker value={value} onSelectDate={changeHandler} />
        </Field>
    );
};
export default EnterpriseFoundationDateField;