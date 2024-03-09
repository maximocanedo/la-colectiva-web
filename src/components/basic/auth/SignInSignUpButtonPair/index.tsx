import React from "react";
import {useTranslation} from "react-i18next";
import {ISignInSignUpButtonPairProps} from "./defs";
import {Button} from "@fluentui/react-components";
import {useNavigate, useNavigation} from "react-router-dom";

const LANG_PATH: string = "components.basics.SignInSignUpButtonPair";
const strings = {
    login: "login",
    signUp: "signUp"
};
const SignInSignUpButtonPair = ({ next }: ISignInSignUpButtonPairProps): React.JSX.Element => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const login = (_e: unknown): void => {
        navigate("/login?next=" + encodeURIComponent(next?? window.location.pathname));
    };
    const signup = (_e: unknown): void => {
        navigate("/signup?next=" + encodeURIComponent(next?? window.location.pathname));
    };

    return (<div className={"rtlCell"}>
        <Button onClick={login} appearance={"secondary"}>{t('pages.login.actions.login')}</Button>
        <Button onClick={signup} appearance={"primary"}>{t('pages.login.actions.signup')}</Button>
    </div>);
};
export default SignInSignUpButtonPair;