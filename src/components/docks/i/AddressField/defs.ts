export interface IAddressFieldProps {
    id: string;
    value: number;
    onUpdate(value: number): void;
    editable: boolean;
}