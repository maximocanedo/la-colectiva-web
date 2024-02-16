import React, {useEffect, useState} from "react";
import {PasswordSectionProps} from "./defs";
import {Button, Field, Input, Spinner} from "@fluentui/react-components";
import {IMailSentFinalResponse, Role} from "../../../../data/models/user";
import {useTranslation} from "react-i18next";
import {StateManager} from "../../../../page/SignUpPage/defs";
import * as users from "../../../../data/actions/user";
import {CommonResponse} from "../../../../data/utils";
import {FieldValidationStatus} from "../RoleSelector/defs";

const LANG_PATH = "components.user.user-page.PasswordSection";
const PasswordSection = (props: PasswordSectionProps): React.JSX.Element => {
    const {user, me}: PasswordSectionProps = props;
    const { t: translationService } = useTranslation();
    const t = (path: string): string => translationService(LANG_PATH + "." + path);
    const [ showEditSection, setShowEditSection ]: StateManager<boolean> = useState<boolean>(false);
    const [ password, setPassword ]: StateManager<string> = useState<string>("");
    const [ passwordValidationMessage, setPasswordValidationMessage ]: StateManager<string> = useState<string>("");
    const [ passwordValidationStatus, setPasswordValidationStatus ]: StateManager<FieldValidationStatus> = useState<FieldValidationStatus>("none");
    const [ rpassword, setRPassword ]: StateManager<string> = useState<string>("");
    const [ rpasswordValidationMessage, setRPasswordValidationMessage ]: StateManager<string> = useState<string>("");
    const [ rpasswordValidationStatus, setRPasswordValidationStatus ]: StateManager<FieldValidationStatus> = useState<FieldValidationStatus>("none");
    const [ updating, setUpdating ] = useState<boolean>(false);
    const [ updated, setUpdated ] = useState<boolean>(false);
    const updatable: boolean = ["success", "none"].indexOf(passwordValidationStatus as string) !== -1 && rpasswordValidationStatus === "success";
    const [ finalMessage, setFinalMessage ] = useState<string>("");
    const ok = (message: string): void => {
        setPasswordValidationMessage(message);
        setPasswordValidationStatus("success");
    };
    const err = (message: string): void => {
        setPasswordValidationMessage(message);
        setPasswordValidationStatus("error");
    };
    const cl = (): void => {
        setPasswordValidationMessage("");
        setPasswordValidationStatus("none");
    };

    const _ok = (message: string): void => {
        setRPasswordValidationMessage(message);
        setRPasswordValidationStatus("success");
    };
    const _err = (message: string): void => {
        setRPasswordValidationMessage(message);
        setRPasswordValidationStatus("error");
    };
    const _cl = (): void => {
        setRPasswordValidationMessage("");
        setRPasswordValidationStatus("none");
    };


    useEffect((): void => {
        const passwordIsOK = (x: string): boolean => x.trim().length >= 8;
        if(password.trim() !== "" && !passwordIsOK(password)) {
            err("La contraseña debe tener como mínimo 8 caracteres. ");
        } else {
            cl();
        }
    }, [password]);

    useEffect((): void => {
        if(rpassword.trim() === "") {
            _cl();
            return;
        }
        if(rpassword.trim() !== password.trim()) {
            _err("Las contraseñas no coinciden. ");
        } else {
            _ok("Las contraseñas coinciden. ");
        }
    }, [password, rpassword]);

    const clearAll = (): void => {
        setPassword("");
        setRPassword("");
        cl();
        _cl();
    };

    if(user === null || !user.email || me === null) return <></>;
    if(me.username !== user.username)
        return <></>;


    const updatePassword = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
        setUpdating(true);
        users.updateMyPassword(password)
            .then((response: CommonResponse): void => {
                if(response.success) {
                    setUpdated(true);
                    setFinalMessage("La contraseña se actualizó correctamente. ");
                    clearAll();
                } else {
                    err("No se actualizó la contraseña. ");
                }
            })
            .catch((error): void => {
                err(error.message + "(" + (error.code?? "S/N") + ")");
            })
            .finally((): void => {
                setUpdating(false);
                clearAll();
            });
    };

    return (<>
        <div className="jBar">
            <span className="l">Contraseña</span>
            {!showEditSection && <Button appearance="secondary" onClick={(e) => {
                setShowEditSection(true);
            }}>
                Cambiar contraseña
            </Button>}
        </div>
        {showEditSection && <>
        {!updated && <><div className="jBar">
                <Field
                    className="fullWidth"
                    label={"Ingrese una nueva contraseña"}
                    validationMessage={passwordValidationMessage}
                    validationState={passwordValidationStatus}
                >
                    <Input
                        type={"password"}
                        disabled={updating}
                        value={password}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>): void => setPassword(e.target.value)}
                    />
                </Field>
            </div>
            <div className="jBar">
                <Field
                    className="fullWidth"
                    label={"Vuelva a ingresar la contraseña"}
                    validationMessage={rpasswordValidationMessage}
                    validationState={rpasswordValidationStatus}
                >
                    <Input
                        disabled={updating}
                        type={"password"}
                        value={rpassword}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>): void => setRPassword(e.target.value)}
                    />
                </Field>
            </div></> }
            {updated && <span>{finalMessage}</span> }
            <div className="rtlCell">
                {(showEditSection) && <Button appearance={updated ? "primary" : "secondary"} onClick={(e) => {
                    setShowEditSection(false);
                    setUpdated(false);
                    clearAll();
                }}>
                    {updated ? "Cerrar" : "Cancelar" }
                </Button>}
                {
                    !updated && <Button onClick={updatePassword} className={"button-loading-spinner"} disabled={!updatable} appearance={"primary"}>
                        { updating && <Spinner size={"extra-tiny"} /> }
                        { updating ? "Actualizando..." : "Cambiar contraseña" }
                    </Button>
                }
            </div>
        </>
        }
    </>);
};
export default PasswordSection;