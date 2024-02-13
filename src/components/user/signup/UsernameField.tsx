import React, {useState} from "react";
import {Field, FieldProps, Input} from "@fluentui/react-components";
import * as users from "./../../../data/actions/user";

interface UsernameFieldProps extends FieldProps {
    value: string;
    onValueChange: (value: string) => void;
    onValidationChange: (error: boolean) => void;
}
const UsernameField = (props: UsernameFieldProps): React.JSX.Element => {
    const [ value, setValue ] = useState<string>(props.value);
    const [ vm, setVM ] = useState<string>("");
    const [ vs, setVS ] = useState<"error" | "warning" | "success" | "none" | undefined>(undefined);
    return <Field
        label="Nombre de usuario"
        validationMessage={vm}
        validationState={vs}
        {...props}
    >
        <Input
            value={value}
            maxLength={24}
            minLength={3}
            onChange={(ev) => {
                const e: string = ev.target.value;
                setValue(e);
                if(e.match(/^[a-zA-Z0-9_.]{3,24}$/)) {
                    setVM("");
                    setVS(undefined);
                    props.onValidationChange(true);
                } else {
                    props.onValidationChange(false);
                    setVS("error")
                    if(e.indexOf(" ") !== -1)
                        setVM("El nombre de usuario no debe contener espacios. ");
                    else
                        setVM("El nombre de usuario debe contener entre 3 y 24 caracteres. ");
                }
                props.onValueChange(e);
        }}
        onBlur={(ev) => {
            const e: string = ev.target.value;
            if (e.match(/^[a-zA-Z0-9_.]{3,24}$/)) {
                setVM("Comprobando... ");
                setVS("warning");
                users.usernameExists(e)
                    .then((exists: boolean) => {
                        if (exists) {
                            setVM("Ese nombre de usuario no está disponible. ");
                            setVS("error");
                            props.onValidationChange(false);
                        } else {
                            setVM("Nombre de usuario disponible");
                            setVS("success");
                            props.onValidationChange(true);
                        }
                    })
                    .catch(() => {
                        setVS("warning");
                        setVM("Ocurrió un error inesperado, intente de nuevo más tarde. ");
                        props.onValidationChange(false);
                    });
            }
        }}


        />
    </Field>
};
export default UsernameField;