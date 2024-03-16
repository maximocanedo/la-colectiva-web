export interface INameFieldProps {
    id: string;
    name: string;
    onUpdate(name: string): void;
    editable: boolean;
}