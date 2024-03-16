export interface IMatFieldProps {
    value: string;
    onChange(value: string): void;
    onCheck(valid: boolean): void;
}