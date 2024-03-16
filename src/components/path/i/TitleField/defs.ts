export interface ITitleFieldProps {
    id: string;
    formalValue: string;
    onUpdate(value: string): void;
    editable: boolean;
}