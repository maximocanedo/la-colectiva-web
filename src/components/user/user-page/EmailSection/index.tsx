import React, {useEffect, useState} from "react";
import {EmailSectionProps} from "./defs";
import {Button, Field, Input, Spinner} from "@fluentui/react-components";
import {IMailSentFinalResponse, Role} from "../../../../data/models/user";
import {useTranslation} from "react-i18next";
import {StateManager} from "../../../../page/SignUpPage/defs";
import * as users from "../../../../data/actions/user";
import {CommonResponse} from "../../../../data/utils";
import {FieldValidationStatus} from "../RoleSelector/defs";

const LANG_PATH = "components.user.user-page.EmailSection";
const EmailSection = (props: EmailSectionProps): React.JSX.Element => {
    const {user, me}: EmailSectionProps = props;
    const { t: translationService } = useTranslation();
    const t = (path: string): string => translationService(LANG_PATH + "." + path);
    const [ showEditSection, setShowEditSection ]: StateManager<boolean> = useState<boolean>(false);
    const [ showCodeSection, setShowCodeSection ]: StateManager<boolean> = useState<boolean>(false);
    const [ newEmail, setNewEmail ]: StateManager<string> = useState<string>("");
    const [ validationId, setValidationId ]: StateManager<string> = useState<string>("");
    const [ code, setCode ]: StateManager<string> = useState<string>("");
    const [ codeValidationMessage, setCodeValidationMessage ]: StateManager<string> = useState<string>("");
    const [ codeValidationStatus, setCodeValidationStatus ]: StateManager<FieldValidationStatus> = useState<FieldValidationStatus>("none");
    const [ mailValidationMessage, setMailValidationMessage ]: StateManager<string> = useState<string>("");
    const [ mailValidationStatus, setMailValidationStatus ]: StateManager<FieldValidationStatus> = useState<FieldValidationStatus>("none");
    const [ sendingCode, setSendingCode ]: StateManager<boolean> = useState<boolean>(false);
    const [ verifyingCode, setVerifyingCode ]: StateManager<boolean> = useState<boolean>(false);


    useEffect((): void => {
        setCodeValidationStatus("none");
        setCodeValidationMessage("");
    }, [showCodeSection, showEditSection]);
    useEffect(() => {
        const isMail = (x: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(x);
        if(newEmail.trim() !== "" && !isMail(newEmail)) {
            setMailValidationMessage(t('err.invalidEmail'));
            setMailValidationStatus("error");
        } else {
            setMailValidationMessage("");
            setMailValidationStatus("none");
        }
    }, [newEmail]);



    if(user === null || !user.email || me === null) return <></>;
    const myRole: Role = me.role?? Role.OBSERVER;
    if(me.username !== user.username && (myRole === Role.ADMINISTRATOR || myRole === Role.MODERATOR))
        return <>
            <div className="jBar">
                <span className="l">{t('label.email')}</span>
                <span className="r">{user.email}</span>
            </div>
        </>
    else if(me.username !== user.username)
        return <></>;

    const sendCode = (_e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
        setSendingCode(true);
        users.updateMail(newEmail)
            .then((response: IMailSentFinalResponse): void => {
                console.log({ response });
                if(response.success && !!response.validationId) {
                    setValidationId(response.validationId);
                    setShowCodeSection(true);
                }
            })
            .catch((error): void => {
                console.error(error);
            })
            .finally((): void => {
                setSendingCode(false);
            });
    };
    const validateCode = (_e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
        setVerifyingCode(true);
        users.tryCode(validationId, code)
            .then((response: CommonResponse): void => {
                console.log({ response });
                if(response.success) {
                    setCodeValidationMessage(t('ok.validated'));
                    setCodeValidationStatus("success");

                    return;
                }
                setCodeValidationStatus("error");
                setCodeValidationMessage(t('err.incorrectCode'));
            })
            .catch((error): void => {
               console.error(error);
                setCodeValidationStatus("error");
                setCodeValidationMessage(t('err.unknown'));

            })
            .finally((): void => {
                setVerifyingCode(false);
            });
    };
    const sendCodeButtonIsDisabled: boolean = newEmail.trim() === "" || (["error", "warning"].indexOf(mailValidationStatus + "") !== -1) || showCodeSection;
    const sendCodeButton: React.JSX.Element = (
        <Button appearance="primary" className={"button-loading-spinner"} disabled={sendCodeButtonIsDisabled} onClick={sendCode}>
            { sendingCode && <Spinner size={"extra-tiny"} /> }
            { sendingCode ? t('label.sending') : t('label.send') }
        </Button>);

    return (<>
        <div className="jBar">
            <span className="l">{t('label.email')}</span>
            <span className="r">{ user.email }</span>
        </div>
        {showEditSection && <>
            <div className="jBar">
                {
                    // TODO: Validate mail and use validation messages.
                }
                <Field
                    className="fullWidth"
                    label={t('label.new')}
                    validationMessage={mailValidationMessage}
                    validationState={mailValidationStatus}
                >
                    <Input
                        type={"email"}
                        disabled={showCodeSection || sendingCode}
                        placeholder={t('label.prefixExample') + user.username + "@example.com"}
                        value={newEmail}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>): void => setNewEmail(e.target.value)}
                    />
                </Field>
            </div>
            { showCodeSection && <div className="rtlCell">
                <Button appearance="secondary" onClick={(e): void => setShowCodeSection(false)}>{ t('label.editEmail') }</Button>
            </div> }
            </>
        }
        { showCodeSection &&
            <div className="rtlCell">
                <Field validationMessage={codeValidationMessage} validationState={codeValidationStatus} label={t('label.enterCodeSent')}>
                    <Input disabled={verifyingCode} type={"text"} value={code} onChange={(e: React.ChangeEvent<HTMLInputElement>): void => setCode(e.target.value)}></Input>
                </Field>

            </div>
        }
        <div className="rtlCell">
            <Button appearance="secondary" onClick={(e) => {
                setShowEditSection(!showEditSection);
                setShowCodeSection(false);
            }}>
                {showEditSection ? t('label.cancel') : t('label.change')}
            </Button>
            {showCodeSection && <Button appearance="primary" className={"button-loading-spinner"} onClick={validateCode}>
                { verifyingCode && <Spinner size={"extra-tiny"} /> }
                { verifyingCode ? t('label.verifying') : t('label.verify') }
            </Button>}
            {!showCodeSection && showEditSection && sendCodeButton }
        </div>
    </>);
};
export default EmailSection;