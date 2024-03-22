import React, {useEffect, useState} from "react";
import {LoginPageProps} from "./defs";
import {useTranslation, UseTranslationResponse} from "react-i18next";
import {StateManager} from "../SignUpPage/defs";
import {Button, MessageBar, MessageBarBody, MessageBarTitle, Title2} from "@fluentui/react-components";
import {IdentifierType} from "../../components/user/login/IdentifierField/defs";
import IdentifierField from "../../components/user/login/IdentifierField/index";
import PasswordField from "../../components/user/login/PasswordField";
import * as auth from "../../data/auth";
import {Credentials} from "../../data/auth";
import {CommonResponse, IError} from "../../data/utils";
import {Err} from "../../data/error";
import {Link, useNavigate, useSearchParams} from "react-router-dom";
import WelcomingTitle from "../../components/basic/WelcomingTitle";
import {BannerData} from "../../components/basic/BannerHandler/defs";
import BannerHandler from "../../components/basic/BannerHandler";


const LoginPage = ({ sendToast }: LoginPageProps): React.JSX.Element => {
    const [searchParams, ] = useSearchParams();
    const { t }: UseTranslationResponse<"translation", undefined> = useTranslation();
    const [ identifier, setIdentifier ]: StateManager<string> = useState<string>("");
    const [ identifierType, setIdentifierType ]: StateManager<IdentifierType> = useState<IdentifierType>("empty");
    const [ password, setPassword ]: StateManager<string> = useState<string>("");
    const [ passwordOK, setPasswordOK ]: StateManager<boolean> = useState<boolean>(false);
    const navigate = useNavigate();
    const validCredentials: boolean = !((identifierType !== "email" && identifierType !== "username") || !passwordOK);
    const [ banner, setBanner ] = useState<BannerData>(null);
    const nextPage: string = searchParams.get("next") !== null ? searchParams.get("next") as string : "/";
    useEffect((): void => {
    }, [ identifier ]);
    return (
        <div className={"main"}>
            <WelcomingTitle content={t("pages.login.title")} />
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
            <BannerHandler data={[ banner ]} />
            <br/>
            <div className="rtlCell" >
                <Button onClick={(): void => {
                    navigate("/signup");
                }} appearance="secondary">
                    {t('pages.login.actions.signup')}
                </Button>
                <Button disabled={!validCredentials} onClick={(_e): void => {
                    const credentials: Credentials = { ...(identifierType === "email" ? { email: identifier } : { username: identifier }), password };
                    auth.login(credentials)
                        .then((_response: CommonResponse): void => {
                            setBanner({
                                intent: "success",
                                title: t('pages.login.ok.loginSuccesful'),
                            });
                            sendToast({
                                title: t('pages.login.ok.loginSuccesful'),
                                intent: "success"
                            });
                            //navigate(nextPage);
                        })
                        .catch((error): void => {
                            console.log(error.code);
                            console.log(error instanceof Err);
                            if(error instanceof Err) {
                                const e: IError = error as IError;
                                setPassword("");
                                setPasswordOK(false);
                                if(e.code === "V-01") setBanner({
                                    title: t('pages.login.err.unauthorized'),
                                    intent: "error"
                                });
                                else setBanner({
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