import {IEditableFieldProps, IEditableFieldValidationStatus} from "./defs";
import React, {useEffect, useState} from "react";
import {Button, Field, Input, Spinner} from "@fluentui/react-components";
import {Edit16Filled} from "@fluentui/react-icons";
import {StateManager} from "../../../page/SignUpPage/defs";
import {FieldValidationStatus} from "../../user/user-page/RoleSelector/defs";
import {useTranslation, UseTranslationResponse} from "react-i18next";
import {log} from "../../page/definitions";

const EditableField = (props: IEditableFieldProps<string>): React.JSX.Element => {
    const { initialValue, editable, onChange, onUpdate, validator, langPath, onValid, onInvalid, onSaving }: IEditableFieldProps<string> = props;
    // Translation functions
    const { t: _translate }: UseTranslationResponse<"translation", undefined> = useTranslation();
    const t = (path: string): string => _translate(langPath + "." + path);

    // Values
    const [ value, setValue ]: StateManager<string> = useState<string>(initialValue);

    // States
    const [ saving, setSaving ]: StateManager<boolean> = useState<boolean>(false);
    const [ updated, setUpdate ]: StateManager<boolean> = useState<boolean>(false);
    const [ editMode, setEditMode ]: StateManager<boolean> = useState<boolean>(false);

    // Validation
    const [ fieldMessage, setFieldMessage ]: StateManager<string> = useState<string>("");
    const [ fieldState, setFieldState ]: StateManager<FieldValidationStatus> = useState<FieldValidationStatus>();
    const validate = (message: string, state: FieldValidationStatus): void => {
        setFieldMessage(message);
        setFieldState(state);
    };

    useEffect((): void => {
        onChange(value);
        const { state, valid, path }: IEditableFieldValidationStatus = validator(value);
        validate( path === "" ? "" : t(path), state);
        valid  ? onValid(value) : onInvalid(value);
    }, [onChange, onInvalid, onValid, t, validator, value]);

    const startEditMode = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
        if(editable) setEditMode(true);
    };
    const cancel = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
        setEditMode(false);
        validate("", "none");
    };
    const save = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
        setSaving(true);
        const end = (succesfullyUpdated: boolean): void => {
            setUpdate(succesfullyUpdated);
            setSaving(false);
            onUpdate(value);
        };
        onSaving(
            ({state, path}: IEditableFieldValidationStatus): void => validate(path === "" ? "" : t(path), state),
            end
        );
    };

    return (<>
        <div className="jBar">
            <span className="l">{t('label')}</span>
            <div className="r flex-edtbl-dt">
                {(!editMode) && <span>{initialValue as string}</span> }
                {(!editMode && editable) &&  <Button onClick={startEditMode} appearance={"subtle"} size={"small"} icon={<Edit16Filled />} />}
            </div>
            { (editMode && editable) && <Field validationMessage={fieldMessage} validationState={fieldState}>
                <Input
                    disabled={saving}
                    type={"text"}
                    value={value}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value)}
                    // TODO { ... props }
                />
            </Field> }
        </div>
        { (editMode && editable) && <div className="rtlCell">
            <Button
                appearance={"primary"}
                onClick={save}
                iconPosition={"before"}
                icon={saving ? <Spinner size={"extra-tiny"} /> : null}
                disabled={saving || initialValue === value}
            >{ saving ? t('st.saving') : t('st.save') }
            </Button>
            <Button
                onClick={cancel}
                appearance={(updated && initialValue === value) ? "primary" : "secondary"}>
                { (updated && initialValue === value) ? t('st.close') : t('st.cancel') }
            </Button>
        </div>}
    </>);
};
export default EditableField;