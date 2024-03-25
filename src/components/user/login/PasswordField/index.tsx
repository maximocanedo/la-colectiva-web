import React, {useState} from "react";
import {Field, Input} from "@fluentui/react-components";
import {useTranslation, UseTranslationResponse} from "react-i18next";
import {PasswordFieldProps} from "./defs";
import {log} from "../../../page/definitions";


const PasswordField = ({ value, onValueChange, onValidationChange }: PasswordFieldProps): React.JSX.Element => {
    log("PasswordField");
    const { t }: UseTranslationResponse<"translation", undefined> = useTranslation();
    const [ passwordNote, setPasswordNote ] = useState<string>("");
    const [ passwordStatus, setPasswordStatus ] = useState<"error" | "warning" | "success" | "none" | undefined>(undefined);


    return <Field
        label={t('components.user.signup.PasswordField.label')}
        validationMessage={passwordNote}
        validationState={passwordStatus}
    >
        <Input
            value={value}
            type="password"
            minLength={8}
            onChange={ e => {
                const { value } = e.target;
                onValueChange(value);
                if(value.trim().length === 0) {
                    setPasswordNote(t('components.user.login.PasswordField.err.enterPassword'));
                    setPasswordStatus("error");
                    onValidationChange(false);
                } else {
                    setPasswordStatus(undefined);
                    setPasswordNote("");
                    onValidationChange(true);
                }
            }}
            />
    </Field>
};
export default PasswordField;