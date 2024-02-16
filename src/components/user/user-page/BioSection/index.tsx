import {BioSectionProps} from "./defs";
import React, {useState} from "react";
import {Role} from "../../../../data/models/user";
import {Button, Field, Input, Spinner} from "@fluentui/react-components";
import { Edit16Filled } from "@fluentui/react-icons";
import {FieldValidationStatus} from "../RoleSelector/defs";
import * as users from "../../../../data/actions/user";
import {CommonResponse} from "../../../../data/utils";
import {useTranslation} from "react-i18next";

const LANG_PATH = "components.user.user-page.BioSection";
const BioSection = (props: BioSectionProps): React.JSX.Element => {
    const { user, me }: BioSectionProps = props;
    const { t: translationService } = useTranslation();
    const t = (path: string): string => translationService(LANG_PATH + "." + path);
    const _bio: string = (user !== null && !!user.bio) ? user.bio : "";
    const [ editMode, setEditMode ] = useState<boolean>(false);
    const [ fieldMessage, setFieldMessage ] = useState<string>("");
    const [ fieldState, setFieldState ] = useState<FieldValidationStatus>("none");
    const [ bio, setBio ] = useState<string>(_bio);
    const [ saving, setSaving ] = useState<boolean>(false);
    const [ newBio, setNewBio ] = useState<string>(_bio);
    const [ updated, setUpdated ] = useState<boolean>(false);
    if(user === null || !user.name || me === null) return <></>;
    const myRole: Role = me.role?? Role.OBSERVER;
    if(me.username !== user.username)
        return <>
            <div className="jBar">
                <span className="l">{t('label')}</span>
                <span className="r">{bio}</span>
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
        const p = itsMe ? users.editMyself({ bio: newBio }) : users.edit(user.username, { bio: newBio });
            p.then((response: CommonResponse): void => {
                if(response.success) {
                    setFieldMessage(t('ok.updated'));
                    setFieldState("success");
                    setUpdated(true);
                    setBio(newBio);
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
            {!editMode && <span>{bio}</span> }
            {!editMode &&  <Button onClick={startEditMode} appearance={"subtle"} size={"small"} icon={<Edit16Filled />} />}</div>
            {editMode && <Field
                validationMessage={fieldMessage}
                validationState={fieldState}
                >
                <Input disabled={saving} type={"text"} value={newBio} onChange={e => setNewBio(e.target.value)} maxLength={24} />
            </Field>}

        </div>
        {editMode && <div className="rtlCell">
            <Button
                appearance={"primary"}
                onClick={save}
                disabled={newBio === bio}
            >{ saving && <Spinner size={"extra-tiny"} /> }
                { saving ? t('st.saving') : t('st.save') }
            </Button>
            <Button
                onClick={cancel}
                appearance={(updated && newBio === bio) ? "primary" : "secondary"}>
                { (updated && newBio === bio) ? t('st.close') : t('st.cancel') }
            </Button>
        </div>}
    </>);
};
export default BioSection;