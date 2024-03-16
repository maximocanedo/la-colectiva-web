export interface IAddressFieldProps {
    value: number;
    onChange(value: number): void;
    onCheck(isValid: boolean): void;
}