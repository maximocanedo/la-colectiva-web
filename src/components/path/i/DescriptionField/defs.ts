export interface IDescriptionFieldProps {
    id: string;
    formalValue: string;
    onUpdate(value: string): void;
    editable: boolean;
}