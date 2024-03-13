import {NameSectionProps} from "./defs";
import React, {useState} from "react";
import {Button, Field, Input, Spinner} from "@fluentui/react-components";
import { Edit16Filled } from "@fluentui/react-icons";
import {FieldValidationStatus} from "../RoleSelector/defs";
import * as users from "../../../../data/actions/user";
import {CommonResponse} from "../../../../data/utils";
import {useTranslation} from "react-i18next";
import {log} from "../../../page/definitions";

const LANG_PATH = "components.user.user-page.NameSection";
const NameSection = (props: NameSectionProps): React.JSX.Element => {
    log("NameSection");
    const { user, me, onChange }: NameSectionProps = props;
    const { t: translationService } = useTranslation();
    const t = (path: string): string => translationService(LANG_PATH + "." + path);
    const _name: string = (user !== null && !!user.name) ? user.name : "";
    const [ editMode, setEditMode ] = useState<boolean>(false);
    const [ fieldMessage, setFieldMessage ] = useState<string>("");
    const [ fieldState, setFieldState ] = useState<FieldValidationStatus>("none");
    const [ name, setName ] = useState<string>(_name);
    const [ saving, setSaving ] = useState<boolean>(false);
    const [ newName, setNewName ] = useState<string>(_name);
    const [ updated, setUpdated ] = useState<boolean>(false);
    if(user === null || !user.name || me === null) return <></>;
    if(me.username !== user.username)
        return <>
            <div className="jBar">
                <span className="l">{t('label')}</span>
                <span className="r">{name}</span>
            </div>
        </>
    else if(me.username !== user.username)
        return <></>;
    const itsMe: boolean = me.username === user.username;



    const startEditMode = (_e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
        setEditMode(true);
    };

    const save = (_e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
        setSaving(true);
        const p = itsMe ? users.editMyself({ name: newName }) : users.edit(user.username, { name: newName });
            p.then((response: CommonResponse): void => {
                if(response.success) {
                    setFieldMessage(t('ok.updated'));
                    setFieldState("success");
                    setUpdated(true);
                    setName(newName);
                    onChange(newName);
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
    const cancel = (_e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
        setEditMode(false);
        setUpdated(false);
    };



    return (<>
        <div className="jBar">
            <span className="l">{t('label')}</span>
            <div className="r flex-edtbl-dt">
            {!editMode && <span>{name}</span> }
            {!editMode &&  <Button onClick={startEditMode} appearance={"subtle"} size={"small"} icon={<Edit16Filled />} />}</div>
            {editMode && <Field
                validationMessage={fieldMessage}
                validationState={fieldState}
                >
                <Input disabled={saving} type={"text"} value={newName} onChange={e => setNewName(e.target.value)} maxLength={24} />
            </Field>}

        </div>
        {editMode && <div className="rtlCell">
            <Button
                appearance={"primary"}
                onClick={save}
                disabled={newName === name}
            >{ saving && <Spinner size={"extra-tiny"} /> }
                { saving ? t('st.saving') : t('st.save') }
            </Button>
            <Button
                onClick={cancel}
                appearance={(updated && newName === name) ? "primary" : "secondary"}>
                { (updated && newName === name) ? t('st.close') : t('st.cancel') }
            </Button>
        </div>}
    </>);
};
export default NameSection;