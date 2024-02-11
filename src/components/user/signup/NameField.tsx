import React, {FormEventHandler, useState} from "react";
import {Field, FieldProps, Input} from "@fluentui/react-components";

interface NameFieldProps extends FieldProps {
    onValueChange: (value: string) => void;
    onValidationChange: (error: boolean) => void;
}
const NameField = (props: NameFieldProps): React.JSX.Element => {
    const [ name, setName ] = useState<string>("");
    const [ vm, setVM ] = useState<string>("");
    const [ vs, setVS ] = useState<"error" | "warning" | "success" | "none" | undefined>(undefined);

    return <Field
        label="Nombre"
        validationMessage={vm}
        validationState={vs}
        {...props}
    >
        <Input
            maxLength={24}
            minLength={3}
            onChange={(ev) => {
                const e: string = ev.target.value;
                setName(ev.target.value);
                props.onValueChange(e);
                if(e.length < 3) {
                    setVM("El nombre debe contener al menos 3 caracteres. ");
                    setVS("error");
                    props.onValidationChange(false);
                } else if(e.length > 24) {
                    setVM("El nombre debe contener hasta 24 caracteres. ");
                    setVS("error");
                    props.onValidationChange(false);
                } else {
                    setVM("");
                    setVS(undefined);
                    props.onValidationChange(true);
                }
        }} />
    </Field>
};
export default NameField;