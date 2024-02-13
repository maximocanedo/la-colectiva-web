import React, {useState} from "react";
import {Field, FieldProps, Input} from "@fluentui/react-components";

interface MailFieldProps extends FieldProps {
    value: string;
    onValueChange: (value: string) => void;
    onValidationChange: (error: boolean) => void;
}
const MailField = (props: MailFieldProps): React.JSX.Element => {
    const [ value, setValue ] = useState<string>(props.value);
    const [ vm, setVM ] = useState<string>("");
    const [ vs, setVS ] = useState<"error" | "warning" | "success" | "none" | undefined>(undefined);

    return <Field
        label="Dirección de correo electrónico"
        validationMessage={vm}
        validationState={vs}
        {...props}
    >
        <Input
            maxLength={64}
            value={value}
            onChange={(ev) => {
                const email: string = ev.target.value;
                setValue(email);
                props.onValueChange(email);

                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

                if (!emailRegex.test(email)) {
                    setVM("La dirección de correo electrónico ingresada no es válida.");
                    setVS("error");
                    props.onValidationChange(false);
                } else {
                    setVM("");
                    setVS("none");
                    props.onValidationChange(true);
                }
            }}
        />
    </Field>
};
export default MailField;