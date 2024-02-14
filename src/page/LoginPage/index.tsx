import React, {useEffect, useState} from "react";
import {LoginPageProps} from "./defs";
import {useTranslation, UseTranslationResponse} from "react-i18next";
import {StateManager} from "../SignUpPage/defs";
import {Button, Spinner, Title2} from "@fluentui/react-components";
import {IdentifierType} from "../../components/user/login/IdentifierField/defs";
import IdentifierField from "../../components/user/login/IdentifierField/index";
import PasswordField from "../../components/user/login/PasswordField";

const LoginPage = (props: LoginPageProps): React.JSX.Element => {
    const { t }: UseTranslationResponse<"translation", undefined> = useTranslation();
    const [ identifier, setIdentifier ]: StateManager<string> = useState<string>("");
    const [ identifierType, setIdentifierType ]: StateManager<IdentifierType> = useState<IdentifierType>("empty");
    const [ password, setPassword ]: StateManager<string> = useState<string>("");
    const [ passwordOK, setPasswordOK ]: StateManager<boolean> = useState<boolean>(false);

    const validCredentials: boolean = !((identifierType !== "email" && identifierType !== "username") || !passwordOK);

    return (
        <div className={"main"}>
            <br/>
            <Title2 align={"center"}>Iniciar sesión</Title2>
            <br/><br/>
            <IdentifierField
                value={identifier}
                onValueChange={(x: string): void => setIdentifier(x)}
                onTypeChange={(x: IdentifierType): void => setIdentifierType(x)}
            />
            <br/>
            <PasswordField value={password} onValueChange={x => setPassword(x)}
                           onValidationChange={x => setPasswordOK(x)}/>
            <br/>

            <br/>
            <div className="rtlCell" >
                <Button onClick={(): void => {
                    // onSignUpButtonClick(data, {setLoading, notify, t});
                }} appearance="secondary">
                    Crear cuenta
                </Button>
                <Button disabled={!validCredentials} onClick={() => {
                           // onSignUpButtonClick(data, {setLoading, notify, t});
                        }} appearance="primary">
                    Ingresar
                </Button>
            </div>
        </div>);
};
export default LoginPage;