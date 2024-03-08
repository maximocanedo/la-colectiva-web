import React, {useState} from "react";
import {Field, Input} from "@fluentui/react-components";
import {NullableRegionType} from "../RegionTypeSelector/defs";
import RegionTypeSelector from "../RegionTypeSelector";
export interface RegionTypeSelectorFieldProps {
    disabled?: boolean;
    value: NullableRegionType;
    onChange(value: NullableRegionType): void;
    onCheck(isValid: boolean): void;
}
type validityState = "none" | "error" | "warning" | "success" | undefined;
const RegionTypeSelectorField = ({ disabled, value, onChange, onCheck }: RegionTypeSelectorFieldProps): React.JSX.Element => {
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

    const checkValidity = (v: NullableRegionType): void => {
        if(v === null) err("Seleccione una opción. ");
        else reset();
    };
    return (
        <Field
            validationState={state}
            validationMessage={message}>
            <RegionTypeSelector disabled={disabled?? false} value={value?? null} onChange={(x: NullableRegionType): void => {
                onChange(x);
                checkValidity(x)
            }} required={false} requiredEmptyLabelOption={"Seleccione categoría"} />
        </Field>);
};
export default RegionTypeSelectorField;