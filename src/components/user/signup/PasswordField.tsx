import React, {FormEventHandler, useState} from "react";
import {Field, FieldProps, Input} from "@fluentui/react-components";

interface PasswordFieldProps extends FieldProps {
    value: string;
    onValueChange: (value: string) => void;
    onValidationChange: (error: boolean) => void;
}
const PasswordField = (props: PasswordFieldProps): React.JSX.Element => {
    const [ value, setValue ] = useState<string>(props.value);
    const [ passwordNote, setPasswordNote ] = useState<string>("");
    const [ passwordStatus, setPasswordStatus ] = useState<"error" | "warning" | "success" | "none" | undefined>(undefined);


    return <Field
        label="Contraseña"
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
                if(value.length < 8) {
                    setPasswordNote("La contraseña debe tener 8 caracteres como mínimo. ");
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