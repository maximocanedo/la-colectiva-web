import React from "react";
import {useTranslation} from "react-i18next";
import {INotFoundComponentProps} from "./defs";
import {Button, Title3} from "@fluentui/react-components";
import SignInSignUpButtonPair from "../../../components/basic/auth/SignInSignUpButtonPair";
import {useNavigate} from "react-router-dom";

const LANG_PATH: string = "err.NotFound";
const strings = {
    title: "title",
    description: "description"
};
const NotFound = ({title, description}: INotFoundComponentProps): React.JSX.Element => {
    const { t: translate } = useTranslation();
    const t = (key: string): string => translate(`${LANG_PATH}.${key}`);
    const navigate = useNavigate();

    return (<center className={"errPage"}>

        <Title3>{ title?? t(strings.title) }</Title3><br/>
        <p>{ description?? t(strings.description) }</p>
        <Button
            appearance={"primary"}
            onClick={(): void => navigate(-1)}>
            {translate("actions.back")}
        </Button>

    </center>);
};
export default NotFound;