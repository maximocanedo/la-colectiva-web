import React, {FormEventHandler, useState} from "react";
import {Field, FieldProps, Input} from "@fluentui/react-components";
import {useTranslation, UseTranslationResponse} from "react-i18next";

interface PasswordFieldProps extends FieldProps {
    value: string;
    onValueChange: (value: string) => void;
    onValidationChange: (error: boolean) => void;
}
const PasswordField = (props: PasswordFieldProps): React.JSX.Element => {
    const { t }: UseTranslationResponse<"translation", undefined> = useTranslation();
    const [ value, setValue ] = useState<string>(props.value);
    const [ passwordNote, setPasswordNote ] = useState<string>("");
    const [ passwordStatus, setPasswordStatus ] = useState<"error" | "warning" | "success" | "none" | undefined>(undefined);


    return <Field
        label={t('components.user.signup.PasswordField.label')}
        validationMessage={passwordNote}
        validationState={passwordStatus}
        {...props}
    >
        <Input
            value={value}
            type="password"
            minLength={8}
            onChange={ e => {
                const { value } = e.target;
                setValue(value);
                props.onValueChange(value);
                if(value.trim().length === 0) {
                    setPasswordNote("Ingrese una contraseña");
                    setPasswordStatus("error");
                    props.onValidationChange(false);
                } else {
                    setPasswordStatus(undefined);
                    setPasswordNote("");
                    props.onValidationChange(true);
                }
            }}
            />
    </Field>
};
export default PasswordField;