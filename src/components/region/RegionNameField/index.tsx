import React, {useState} from "react";
import {Field, Input} from "@fluentui/react-components";
type validityState = "none" | "error" | "warning" | "success" | undefined;
export interface RegionNameFieldProps {
    disabled?: boolean;
    value: string;
    onChange(value: string): void;
    onCheck(isValid: boolean): void;
}
const RegionNameField = ({ disabled, value, onChange, onCheck }: RegionNameFieldProps): React.JSX.Element => {

    const [ state, setState ] = useState<validityState>("none");
    const [ message, setMessage ] = useState<string>("");

    const err = (message: string): void => {
        setState("error");
        setMessage(message);
        onCheck(false);
    };
    const warn = (message: string): void => {
        setState("warning");
        setMessage(message);
    };
    const ok = (message: string): void => {
        setState("success");
        setMessage(message);
    }
    const reset = (): void => {
        setState("none");
        setMessage("");
        onCheck(true);
    };

    const checkValidity = (v: string): void => {
        if(v.length < 3) err("El nombre debe contener mínimo 3 caracteres. ");
        else if(v.length > 48) err("El nombre no puede contener más de 48 caracteres. ");
        else reset();
    };

    return (
        <Field
            validationState={state}
            validationMessage={message}>
            <Input
                disabled={disabled?? false}
                type={"text"} minLength={3} maxLength={48}
                placeholder={"Ingresá sólo el nombre propio de la región."}
                value={value}
                onChange={(e): void => {
                    onChange(e.target.value);
                    checkValidity(e.target.value);
                }}
            />
    </Field>);
};
export default RegionNameField;