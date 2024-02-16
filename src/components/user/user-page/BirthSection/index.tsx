import {BirthSectionProps} from "./defs";
import React, {useState} from "react";
import {Birth, Role} from "../../../../data/models/user";
import {Button, Field, Input, Spinner} from "@fluentui/react-components";
import { Edit16Filled } from "@fluentui/react-icons";
import {FieldValidationStatus} from "../RoleSelector/defs";
import * as users from "../../../../data/actions/user";
import {CommonResponse} from "../../../../data/utils";
import {useTranslation} from "react-i18next";
import {DatePicker} from "@fluentui/react-datepicker-compat";

const LANG_PATH = "components.user.user-page.BirthSection";
const BirthSection = (props: BirthSectionProps): React.JSX.Element => {
    const { user, me }: BirthSectionProps = props;
    const { t: translationService } = useTranslation();
    const t = (path: string): string => translationService(LANG_PATH + "." + path);
    const _birth: Birth = (user !== null && !!user.birth) ? user.birth : "";
    const [ editMode, setEditMode ] = useState<boolean>(false);
    const [ fieldMessage, setFieldMessage ] = useState<string>("");
    const [ fieldState, setFieldState ] = useState<FieldValidationStatus>("none");
    const [ birth, setBirth ] = useState<Birth>(_birth);
    const [ saving, setSaving ] = useState<boolean>(false);
    const [ newBirth, setNewBirth ] = useState<Birth>(_birth);
    const [ updated, setUpdated ] = useState<boolean>(false);

    if(user === null || !user.name || me === null) return <></>;

    const options: Intl.DateTimeFormatOptions = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    };
    const formattedBirth: string = new Date(birth).toLocaleDateString(undefined, options);

    if(me.username !== user.username)
        return <>
            <div className="jBar">
                <span className="l">{t('label')}</span>
                <span className="r">{formattedBirth}</span>
            </div>
        </>
    else if(me.username !== user.username)
        return <></>;
    const itsMe: boolean = me.username === user.username;



    const startEditMode = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
        setEditMode(true);
    };

    const save = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
        setSaving(true);
        const p = itsMe ? users.editMyself({ birth: newBirth }) : users.edit(user.username, { birth: newBirth });
            p.then((response: CommonResponse): void => {
                if(response.success) {
                    setFieldMessage(t('ok.updated'));
                    setFieldState("success");
                    setUpdated(true);
                    setBirth(newBirth);
                } else {
                    setFieldMessage('err.couldntUpdate');
                    setFieldState("error");
                }
            })
            .catch((error): void => {
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



    return (<>
        <div className="jBar">
            <span className="l">{t('label')}</span>
            <div className="r flex-edtbl-dt">
            {!editMode && <span>{formattedBirth}</span> }
            {!editMode &&  <Button onClick={startEditMode} appearance={"subtle"} size={"small"} icon={<Edit16Filled />} />}</div>
            {editMode && <Field
                validationMessage={fieldMessage}
                validationState={fieldState}
                >
                <DatePicker
                    value={new Date(newBirth)}
                    onSelectDate={(date): void => {
                        if(date) setNewBirth(date);
                    }}
                    disabled={saving}
                />
            </Field>}

        </div>
        {editMode && <div className="rtlCell">
            <Button
                appearance={"primary"}
                onClick={save}
                disabled={newBirth === birth}
            >{ saving && <Spinner size={"extra-tiny"} /> }
                { saving ? t('st.saving') : t('st.save') }
            </Button>
            <Button
                onClick={cancel}
                appearance={(updated && newBirth === birth) ? "primary" : "secondary"}>
                { (updated && newBirth === birth) ? t('st.close') : t('st.cancel') }
            </Button>
        </div>}
    </>);
};
export default BirthSection;