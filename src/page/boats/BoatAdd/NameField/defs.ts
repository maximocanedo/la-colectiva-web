export interface INameFieldProps {
    value: string;
    onChange(value: string): void;
    onCheck(valid: boolean): void;
}