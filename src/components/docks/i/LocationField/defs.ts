export interface ILocationFieldProps {
    editable: boolean;
    value: [ number, number ];
    onUpdate(value: [ number, number ]): void;
    id: string;
}