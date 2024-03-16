export interface IDescriptionFieldProps {
    value: string;
    onChange(value: string): void;
    onCheck(isValid: boolean): void;
}