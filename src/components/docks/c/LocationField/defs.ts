export interface ILocationFieldProps {
    value: [number, number];
    onChange(value: [number, number]): void;
    onCheck(isValid: boolean): void;
}