import React, {useEffect, useState} from "react";
import {LoginPageProps} from "./defs";
import {useTranslation, UseTranslationResponse} from "react-i18next";
import {StateManager} from "../SignUpPage/defs";
import {
    Button,
    Title2,
    Toast,
    ToastBody,
    ToastIntent,
    ToastTitle,
    useToastController
} from "@fluentui/react-components";
import {IdentifierType} from "../../components/user/login/IdentifierField/defs";
import IdentifierField from "../../components/user/login/IdentifierField/index";
import PasswordField from "../../components/user/login/PasswordField";
import * as auth from "../../data/auth";
import {Credentials} from "../../data/auth";
import {CommonResponse, IError} from "../../data/utils";
import {Err} from "../../data/error";
import {useSearchParams} from "react-router-dom";



const LoginPage = ({ toasterId }: LoginPageProps): React.JSX.Element => {
    const [searchParams, setSearchParams] = useSearchParams();
    const { t }: UseTranslationResponse<"translation", undefined> = useTranslation();
    const [ identifier, setIdentifier ]: StateManager<string> = useState<string>("");
    const [ identifierType, setIdentifierType ]: StateManager<IdentifierType> = useState<IdentifierType>("empty");
    const [ password, setPassword ]: StateManager<string> = useState<string>("");
    const [ passwordOK, setPasswordOK ]: StateManager<boolean> = useState<boolean>(false);

    const validCredentials: boolean = !((identifierType !== "email" && identifierType !== "username") || !passwordOK);
    const { dispatchToast } = useToastController(toasterId);
    const nextPage: string = searchParams.get("next") !== null ? searchParams.get("next") as string : "/";
    useEffect((): void => {
    }, [ identifier ]);
    const notify = (message: string, type: ToastIntent, description?: string) =>
        dispatchToast(
            <Toast>
                <ToastTitle>{message}</ToastTitle>
                { description && <ToastBody subtitle="Subtitle">{ description }</ToastBody> }
            </Toast>,
            { intent: type }
        );
    return (
        <div className={"main"}>
            <br/>
            <Title2 align={"center"}>{t('pages.login.title')}</Title2>
            <br/><br/><br/>
            <IdentifierField
                value={identifier}
                onValueChange={(x: string): void => setIdentifier(x)}
                onTypeChange={(x: IdentifierType): void => setIdentifierType(x)}
            />
            <br/>
            <PasswordField
                value={password}
                onValueChange={(x: string): void => setPassword(x)}
                onValidationChange={(x: boolean): void => setPasswordOK(x)}
            />
            <br/>
            <br/>
            <div className="rtlCell" >
                <Button onClick={(e): void => {
                    window.location.href = "/signup";
                }} appearance="secondary">
                    {t('pages.login.actions.signup')}
                </Button>
                <Button disabled={!validCredentials} onClick={(e): void => {
                    const credentials: Credentials = { ...(identifierType === "email" ? { email: identifier } : { username: identifier }), password };
                    auth.login(credentials)
                        .then((response: CommonResponse): void => {
                            notify(t('pages.login.ok.loginSuccessful'), "success");
                            window.location.href = nextPage;
                        })
                        .catch((error): void => {
                            console.log(error.code);
                            console.log(error instanceof Err);
                            if(error instanceof Err) {
                                const e: IError = error as IError;
                                if(e.code === "V-01") notify(t('pages.login.err.unauthorized'), "error");
                                else notify(t('pages.login.err.unknown'), "error");
                            }
                        });
                        }} appearance="primary">
                    { t('pages.login.actions.login') }
                </Button>
            </div>
        </div>);
};
export default LoginPage;