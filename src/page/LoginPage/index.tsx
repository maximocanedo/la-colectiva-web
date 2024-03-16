import React, {useEffect, useState} from "react";
import {LoginPageProps} from "./defs";
import {useTranslation, UseTranslationResponse} from "react-i18next";
import {StateManager} from "../SignUpPage/defs";
import {Button, Title2} from "@fluentui/react-components";
import {IdentifierType} from "../../components/user/login/IdentifierField/defs";
import IdentifierField from "../../components/user/login/IdentifierField/index";
import PasswordField from "../../components/user/login/PasswordField";
import * as auth from "../../data/auth";
import {Credentials} from "../../data/auth";
import {CommonResponse, IError} from "../../data/utils";
import {Err} from "../../data/error";
import {useSearchParams} from "react-router-dom";


const LoginPage = ({ sendToast }: LoginPageProps): React.JSX.Element => {
    const [searchParams, ] = useSearchParams();
    const { t }: UseTranslationResponse<"translation", undefined> = useTranslation();
    const [ identifier, setIdentifier ]: StateManager<string> = useState<string>("");
    const [ identifierType, setIdentifierType ]: StateManager<IdentifierType> = useState<IdentifierType>("empty");
    const [ password, setPassword ]: StateManager<string> = useState<string>("");
    const [ passwordOK, setPasswordOK ]: StateManager<boolean> = useState<boolean>(false);

    const validCredentials: boolean = !((identifierType !== "email" && identifierType !== "username") || !passwordOK);

    const nextPage: string = searchParams.get("next") !== null ? searchParams.get("next") as string : "/";
    useEffect((): void => {
    }, [ identifier ]);
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
                <Button onClick={(_e): void => {
                    window.location.href = "/signup";
                }} appearance="secondary">
                    {t('pages.login.actions.signup')}
                </Button>
                <Button disabled={!validCredentials} onClick={(_e): void => {
                    const credentials: Credentials = { ...(identifierType === "email" ? { email: identifier } : { username: identifier }), password };
                    auth.login(credentials)
                        .then((_response: CommonResponse): void => {
                            sendToast({
                                title: t('pages.login.ok.loginSuccesful'),
                                intent: "success"
                            })
                            window.location.href = nextPage;
                        })
                        .catch((error): void => {
                            console.log(error.code);
                            console.log(error instanceof Err);
                            if(error instanceof Err) {
                                const e: IError = error as IError;
                                if(e.code === "V-01") sendToast({
                                    title: t('pages.login.err.unauthorized'),
                                    intent: "error"
                                });
                                else sendToast({
                                    title: t('pages.login.err.unknown'),
                                    intent: "error"
                                });
                            }
                        });
                        }} appearance="primary">
                    { t('pages.login.actions.login') }
                </Button>
            </div>
        </div>);
};
export default LoginPage;