import {FieldProps} from "@fluentui/react-components";

export interface PasswordFieldProps extends FieldProps {
    value: string;
    onValueChange: (value: string) => void;
    onValidationChange: (error: boolean) => void;
}