export interface INotesFieldProps {
    value: string;
    onChange(value: string): void;
    onCheck(isValid: boolean): void;
}