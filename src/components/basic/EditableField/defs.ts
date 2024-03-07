import {FieldValidationStatus} from "../../user/user-page/RoleSelector/defs";

export interface IEditableFieldValidationStatus {
    valid: boolean;
    path: string;
    state: FieldValidationStatus;
}
export interface IEditableFieldProps<T> {
    langPath: string;
    initialValue: T;
    editable: boolean;
    onChange(value: T): void;
    onUpdate(value: T): void;
    validator(value: T): IEditableFieldValidationStatus;
    onSaving(
        validate: (status: IEditableFieldValidationStatus) => void,
        end: (succesfullyUpdated: boolean) => void
    ): void;
    onValid(value: T): void;
    onInvalid(value: T): void;
}