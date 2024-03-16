import React, {FormEventHandler, useState} from "react";
import {Field, FieldProps, Input} from "@fluentui/react-components";
import {useTranslation, UseTranslationResponse} from "react-i18next";
import {log} from "../../page/definitions";

interface RepeatPasswordFieldProps extends FieldProps {
    value: string;
    password: string;
    onValueChange: (value: string) => void;
    onValidationChange: (error: boolean) => void;
}
const RepeatPasswordField = (props: RepeatPasswordFieldProps): React.JSX.Element => {
    log("RepeatPasswordField");
    const { t }: UseTranslationResponse<"translation", undefined> = useTranslation();
    const [ value, setValue ] = useState<string>(props.value);
    const [ passwordNote, setPasswordNote ] = useState<string>("");
    const [ passwordStatus, setPasswordStatus ] = useState<"error" | "warning" | "success" | "none" | undefined>(undefined);


    return <Field
        label={t('components.user.signup.RepeatPasswordField.label')}
        validationMessage={passwordNote}
        validationState={passwordStatus}
        {...props}
    >
        <Input
            type="password"
            value={value}
            onChange={ e => {
                const { value } = e.target;
                setValue(value);
                props.onValueChange(value);
                if(props.password !== value) {
                    setPasswordNote(t('components.user.signup.RepeatPasswordField.err.dontMatch'));
                    setPasswordStatus("error");
                    props.onValidationChange(false);
                } else {
                    setPasswordStatus("success");
                    setPasswordNote(t('components.user.signup.RepeatPasswordField.ok.match'));
                    props.onValidationChange(true);
                }
            }}
            />
    </Field>
};
export default RepeatPasswordField;