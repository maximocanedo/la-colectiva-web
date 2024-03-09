import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {IEnterpriseCUITPageFieldProps} from "./defs";
import {FieldValidationStatus} from "../../user/user-page/RoleSelector/defs";
import {Button, Field, Input, Spinner} from "@fluentui/react-components";
import {Edit16Filled} from "@fluentui/react-icons";
import * as enterprises from "../../../data/actions/enterprise";
import {CommonResponse} from "../../../data/utils";

const LANG_PATH: string = "components.enterprise.EnterpriseCUIT";
const strings = {};
const EnterpriseCUITPageField = ({ id, value: outValue, onChange, me, author }: IEnterpriseCUITPageFieldProps): React.JSX.Element => {
    const { t: translate } = useTranslation();
    const t = (key: string): string => translate(`${LANG_PATH}.${key}`);
    // Values
    const [ value, setValue ] = useState<number>(outValue);
    // States
    const [ saving, setSaving ] = useState<boolean>(false);
    const [ updated, setUpdate ] = useState<boolean>(false);
    const [ editMode, setEditMode ] = useState<boolean>(false);

    // Validation
    const [ fieldMessage, setFieldMessage ] = useState<string>("");
    const [ fieldState, setFieldState ] = useState<FieldValidationStatus>();
    const validate = (message: string, state: FieldValidationStatus): void => {
        setFieldMessage(message);
        setFieldState(state);
    };
    const editable: boolean = me !== null && me !== undefined && author !== undefined && author !== null
        && (me.active) && (me.role === 3 || (me.role === 2 && (me._id === author._id)));


    const startEditMode = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
        if(editable) {
            setEditMode(true);
            setUpdate(false);
        }
    };
    const cancel = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
        setEditMode(false);
        validate("", "none");
    };
    const save = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
        setSaving(true);
        enterprises.edit(id, { cuit: value })
            .then((response: CommonResponse): void => {
                if(response.success) {
                    onChange(value);
                    setUpdate(true);
                }
            }).catch(err => console.error(err)).finally((): void => {
                setSaving(false);
        });
    };

    return (<>
        <div className="jBar">
            <span className="l">{t('label')}</span>
            <div className="r flex-edtbl-dt">
                {(!editMode) && <span>{enterprises.formatCUIT(value)}</span> }
                {(!editMode && editable) &&  <Button onClick={startEditMode} appearance={"subtle"} size={"small"} icon={<Edit16Filled />} />}
            </div>
            { (editMode && editable) && <Field validationMessage={fieldMessage} validationState={fieldState}>
                <Input
                    disabled={saving}
                    type={"number"}
                    min={1000}
                    max={999999999999}
                    value={value + ""}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setValue(parseInt(e.target.value))
                        if(value !== outValue) setUpdate(false);
                    }}
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
                disabled={saving || outValue === value}
            >{ saving ? t('st.saving') : t('st.save') }
            </Button>
            <Button
                onClick={cancel}
                appearance={(updated && outValue === value) ? "primary" : "secondary"}>
                { (updated && outValue === value) ? t('st.close') : t('st.cancel') }
            </Button>
        </div>}
    </>);
};
export default EnterpriseCUITPageField;