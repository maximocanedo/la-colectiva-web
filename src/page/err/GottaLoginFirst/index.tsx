import React from "react";
import {useTranslation} from "react-i18next";
import {IGottaLoginFirstComponentProps} from "./defs";
import {Title3} from "@fluentui/react-components";
import SignInSignUpButtonPair from "../../../components/basic/auth/SignInSignUpButtonPair";

const LANG_PATH: string = "err.GottaLoginFirst";
const strings = {
    title: "title",
    description: "description"
};
const GottaLoginFirst = ({title, description}: IGottaLoginFirstComponentProps): React.JSX.Element => {
    const { t: translate } = useTranslation();
    const t = (key: string): string => translate(`${LANG_PATH}.${key}`);

    return (<center>

        <Title3>{ title?? t(strings.title) }</Title3><br/>
        <p>{ description?? t(strings.description) }</p>
        <SignInSignUpButtonPair />

    </center>);
};
export default GottaLoginFirst;