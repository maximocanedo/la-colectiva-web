import {IEnterpriseFoundationDatePageFieldProps} from "./defs";
import React, {useState} from "react";
import {Button, Field, Spinner} from "@fluentui/react-components";
import { Edit16Filled } from "@fluentui/react-icons";
import {useTranslation} from "react-i18next";
import {DatePicker} from "@fluentui/react-datepicker-compat";
import {FieldValidationStatus} from "../../user/user-page/RoleSelector/defs";
import * as enterprises from "../../../data/actions/enterprise";
import {CommonResponse} from "../../../data/utils";
import {log} from "../../page/definitions";

const LANG_PATH = "components.enterprise.FoundationField";
const EnterpriseFoundationDatePageField = (props: IEnterpriseFoundationDatePageFieldProps): React.JSX.Element => {
    const { me, id, date, onChange, user }: IEnterpriseFoundationDatePageFieldProps = props;
    const { t: translationService } = useTranslation();
    log("EnterpriseFoundationDatePageField");
    const t = (path: string): string => translationService(LANG_PATH + "." + path);
    const [ editMode, setEditMode ] = useState<boolean>(false);
    const [ fieldMessage, setFieldMessage ] = useState<string>("");
    const [ fieldState, setFieldState ] = useState<FieldValidationStatus>("none");
    const [ value, setValue ] = useState<Date>(date);
    const [ saving, setSaving ] = useState<boolean>(false);

    const [ updated, setUpdated ] = useState<boolean>(false);


    const options: Intl.DateTimeFormatOptions = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    };
    const formattedBirth: string = new Date(value).toLocaleDateString(translationService("defLang"), options);




    const startEditMode = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
        setEditMode(true);
    };

    const save = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
        setSaving(true);
        enterprises.edit(id, { foundationDate: new Date(value) })
            .then((response: CommonResponse): void => {
                if(response.success) {
                    setFieldMessage(t('ok.updated'));
                    setFieldState("success");
                    setUpdated(true);
                    onChange(value);
                } else {
                    setFieldMessage('err.couldntUpdate');
                    setFieldState("error");
                }
            })
            .catch((error: any): void => {
                setFieldMessage(error.message + " (" + (error.code?? "S/N") + ")");
                setFieldState("error");
            })
            .finally((): void => {
                setSaving(false);
            });
    };
    const cancel = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
        setEditMode(false);
        setUpdated(false);
    };
    const canEdit: boolean = user !== null && user !== undefined && me !== null && me !== undefined
     && me.active && (me.role === 3 || (me.role === 2 && me._id === user._id));


    return (<>
        <div className="jBar">
            <span className="l">{t('label')}</span>
            <div className="r flex-edtbl-dt">
            {!editMode && <span>{formattedBirth}</span> }
            {!editMode && canEdit && <Button onClick={startEditMode} appearance={"subtle"} size={"small"} icon={<Edit16Filled />} />}</div>
            {editMode && canEdit && <Field
                validationMessage={fieldMessage}
                validationState={fieldState}
                >
                <DatePicker
                    value={new Date(value)}
                    onSelectDate={(date): void => {
                        if(date) setValue(date);
                    }}
                    disabled={saving}
                />
            </Field>}

        </div>
        {editMode && canEdit && <div className="rtlCell">
            <Button
                appearance={"primary"}
                onClick={save}
                disabled={date === value}
            >{ saving && <Spinner size={"extra-tiny"} /> }
                { saving ? t('st.saving') : t('st.save') }
            </Button>
            <Button
                onClick={cancel}
                appearance={(updated && date === value) ? "primary" : "secondary"}>
                { (updated && date === value) ? t('st.close') : t('st.cancel') }
            </Button>
        </div>}
    </>);
};
export default EnterpriseFoundationDatePageField;