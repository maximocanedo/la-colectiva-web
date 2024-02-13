import React, {FormEventHandler, useState} from "react";
import {Field, FieldProps, Input} from "@fluentui/react-components";

interface RepeatPasswordFieldProps extends FieldProps {
    value: string;
    password: string;
    onValueChange: (value: string) => void;
    onValidationChange: (error: boolean) => void;
}
const RepeatPasswordField = (props: RepeatPasswordFieldProps): React.JSX.Element => {
    const [ value, setValue ] = useState<string>(props.value);
    const [ passwordNote, setPasswordNote ] = useState<string>("");
    const [ passwordStatus, setPasswordStatus ] = useState<"error" | "warning" | "success" | "none" | undefined>(undefined);


    return <Field
        label="Repita la contraseña"
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
                    setPasswordNote("Las contraseñas no coinciden. ");
                    setPasswordStatus("error");
                    props.onValidationChange(false);
                } else {
                    setPasswordStatus("success");
                    setPasswordNote("Las contraseñas coinciden");
                    props.onValidationChange(true);
                }
            }}
            />
    </Field>
};
export default RepeatPasswordField;