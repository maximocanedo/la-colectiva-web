import React, {FormEventHandler, useState} from "react";
import {Field, FieldProps, Input, Textarea} from "@fluentui/react-components";

interface BioFieldProps extends FieldProps {
    value: string;
    onValueChange: (value: string) => void;
    onValidationChange: (error: boolean) => void;
}
const BioField = (props: BioFieldProps): React.JSX.Element => {
    const [ value, setValue ] = useState<string>(props.value);
    const [ vm, setVM ] = useState<string>("");
    const [ vs, setVS ] = useState<"error" | "warning" | "success" | "none" | undefined>(undefined);

    return <Field
        label="Biografía"
        validationMessage={vm}
        validationState={vs}
        {...props}
    >
        <Textarea
            value={value}
            maxLength={48}
            onChange={(ev) => {
                const e: string = ev.target.value;
                setValue(e);
                props.onValueChange(e);
                if(e.length > 48) {
                    setVM("La biografía puede contener hasta 48 caracteres. ");
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
export default BioField;