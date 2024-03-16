export interface ITitleFieldProps {
    value: string;
    onChange(value: string): void;
    onCheck(isValid: boolean): void;
}