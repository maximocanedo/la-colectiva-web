export interface INotesFieldProps {
    id: string;
    formalValue: string;
    onUpdate(value: string): void;
    editable: boolean;
}