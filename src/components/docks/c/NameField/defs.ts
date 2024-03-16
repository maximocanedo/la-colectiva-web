export interface INameFieldProps {
    value: string;
    onChange(value: string): void;
    onCheck(isValid: boolean): void;
}