export interface INotesFieldProps {
    id: string;
    notes: string;
    onUpdate(notes: string): void;
    editable: boolean;
}