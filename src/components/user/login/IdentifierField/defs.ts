import {FieldProps} from "@fluentui/react-components";

export type IdentifierType = "email" | "username" | "neither" | "empty";
export interface IdentifierFieldProps extends FieldProps {
    value: string;
    onValueChange: (value: string) => void;
    onTypeChange: (type: IdentifierType) => void;
}