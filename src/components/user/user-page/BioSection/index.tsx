import {BioSectionProps} from "./defs";
import React, {useState} from "react";
import {Role} from "../../../../data/models/user";
import {Button, Field, Input, Spinner} from "@fluentui/react-components";
import { Edit16Filled } from "@fluentui/react-icons";
import {FieldValidationStatus} from "../RoleSelector/defs";
import * as users from "../../../../data/actions/user";
import {CommonResponse} from "../../../../data/utils";

const BioSection = (props: BioSectionProps): React.JSX.Element => {
    const { user, me }: BioSectionProps = props;
    const _bio: string = (user !== null && !!user.bio) ? user.bio : "";
    const [ editMode, setEditMode ] = useState<boolean>(false);
    const [ fieldMessage, setFieldMessage ] = useState<string>("");
    const [ fieldState, setFieldState ] = useState<FieldValidationStatus>("none");
    const [ bio, setBio ] = useState<string>(_bio);
    const [ saving, setSaving ] = useState<boolean>(false);
    const [ newBio, setNewBio ] = useState<string>(_bio);
    const [ updated, setUpdated ] = useState<boolean>(false);
    if(user === null || !user.email || me === null) return <></>;
    const myRole: Role = me.role?? Role.OBSERVER;
    if(me.username !== user.username)
        return <>
            <div className="jBar">
                <span className="l">Biografía</span>
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
        const _fn: string = itsMe ? "editMyself" : "edit";
        setSaving(true);
        const p = itsMe ? users.editMyself({ bio: newBio }) : users.edit(user.username, { bio: newBio });
            p.then((response: CommonResponse): void => {
                if(response.success) {
                    setFieldMessage("Actualizado con éxito. ");
                    setFieldState("success");
                    setUpdated(true);
                    setBio(newBio);
                } else {
                    setFieldMessage("No se pudo actualizar. ");
                    setFieldState("error");
                }
            })
            .catch((error): void => {
                setFieldMessage(error.message + " (" + error.code?? "S/N" + ")");
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
            <span className="l">Biografía:</span>
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
                { saving ? "Guardando..." : "Guardar" }
            </Button>
            <Button
                onClick={cancel}
                appearance={(updated && newBio === bio) ? "primary" : "secondary"}>
                { (updated && newBio === bio) ? "Cerrar" : "Cancelar" }
            </Button>
        </div>}
    </>);
};
export default BioSection;