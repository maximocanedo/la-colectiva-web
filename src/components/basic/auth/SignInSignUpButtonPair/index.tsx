import React from "react";
import {useTranslation} from "react-i18next";
import {ISignInSignUpButtonPairProps} from "./defs";
import {Button} from "@fluentui/react-components";
import {useNavigate, useNavigation} from "react-router-dom";
import {log} from "../../../page/definitions";

const LANG_PATH: string = "components.basics.SignInSignUpButtonPair";
const strings = {
    login: "login",
    signUp: "signUp"
};
const SignInSignUpButtonPair = ({ next, onClick }: ISignInSignUpButtonPairProps): React.JSX.Element => {
    log("SignInSignUpButtonPair");
    const { t } = useTranslation();
    const navigate = useNavigate();

    const login = (_e: unknown): void => {
        navigate("/login?next=" + encodeURIComponent(next?? window.location.pathname));
        if(onClick) onClick();
    };
    const signup = (_e: unknown): void => {
        navigate("/signup?next=" + encodeURIComponent(next?? window.location.pathname));
        if(onClick) onClick();
    };

    return (<div className={"rtlCell"}>
        <Button onClick={login} appearance={"secondary"}>{t('pages.login.actions.login')}</Button>
        <Button onClick={signup} appearance={"primary"}>{t('pages.login.actions.signup')}</Button>
    </div>);
};
export default SignInSignUpButtonPair;