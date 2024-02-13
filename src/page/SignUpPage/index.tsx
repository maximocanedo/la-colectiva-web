import React, {useEffect, useState} from "react";
import NameField from "../../components/user/signup/NameField";
import UsernameField from "../../components/user/signup/UsernameField";
import BioField from "../../components/user/signup/BioField";
import BirthField from "../../components/user/signup/BirthField";
import PasswordField from "../../components/user/signup/PasswordField";
import RepeatPasswordField from "../../components/user/signup/RepeatPasswordField";
import MailField from "../../components/user/signup/MailField";
import {
    Button,
    SelectTabData,
    SelectTabEvent,
    Spinner,
    Tab,
    TabList,
    Title2, Toast, ToastBody, ToastIntent, ToastTitle, useToastController
} from "@fluentui/react-components";
import {ISignUpRequest, ISignUpResponse} from "../../data/models/user";
import * as users from "../../data/actions/user";
import * as auth from "../../data/auth";
import {Credentials} from "../../data/auth";
import {CommonResponse} from "../../data/utils";
import {
    OnSignUpButtonClickFunctions, SignUpPageProps, SignUpTabValue, StateManager,
    TabAccountFunctions,
    TabAccountStates, TabMoreFunctions,
    TabMoreStates,
    TabPersonalFunctions,
    TabPersonalStates
} from "./defs";


const tabs = {
    personal: (states: TabPersonalStates, functions: TabPersonalFunctions) => {
        const { name, username, birth }: TabPersonalStates = states;
        const { setName, setUsername, setBirth, setBirthValidity, setNameValidity, setUsernameValidity, setSelectedValue }: TabPersonalFunctions = functions;
        return (<>
            <NameField
                value={name}
                onValueChange={(value: string) => setName(value) }
                onValidationChange={(e: boolean) => setNameValidity(e)} />
            <br/>
            <UsernameField
                value={username}
                onValueChange={(value: string) => setUsername(value) }
                onValidationChange={ (x: boolean) => setUsernameValidity(x) } />
            <br/>
            <BirthField
                value={birth}
                onValueChange={(value: Date) => setBirth(value)}
                onValidationChange={(x: boolean) => setBirthValidity(x)} />
            <br/><br/>
            <div className="rtlCell">
                <Button onClick={() => setSelectedValue("account")} appearance={"primary"}>
                    Siguiente
                </Button></div>
        </>);
    },
    account: (states: TabAccountStates, functions: TabAccountFunctions) => {
        const { email, password, repeatPassword }: TabAccountStates = states;
        const { setEmail, setMailValidity, setPassword, setPasswordValidity,
            setRepeatPassword, setPasswordsEquality, setSelectedValue }: TabAccountFunctions = functions;
        return (<>
            <MailField
                value={email}
                onValueChange={(value: string) => setEmail(value)}
                onValidationChange={(x: boolean) => setMailValidity(x)}/>
            <br/>
            <PasswordField
                value={password}
                onValueChange={(value: string) => setPassword(value)}
                onValidationChange={(x: boolean) => setPasswordValidity(x)}/>
            <br/>
            <RepeatPasswordField
                password={password}
                value={repeatPassword}
                onValueChange={(value: string) => setRepeatPassword(value)}
                onValidationChange={(x: boolean) => setPasswordsEquality(x)}/>
            <br/><br/>
            <div className="rtlCell">
                <Button onClick={() => setSelectedValue("more")} appearance={"primary"}>
                    Siguiente
                </Button></div>
        </>);
    },
    more: (states: TabMoreStates, functions: TabMoreFunctions) => {
        const { bio, allValid, loading, data }: TabMoreStates = states;
        const { setBio, setBioValidity, setLoading, notify, onSignUpButtonClick }: TabMoreFunctions = functions;
        return (<>
            <BioField
                value={bio}
                onValueChange={(value: string) => setBio(value)}
                onValidationChange={(x: boolean) => setBioValidity(x)}/>
            <br/>
            <div className="rtlCell">
                <Button disabled={!allValid} iconPosition={"before"} icon={loading ? <Spinner size={"extra-tiny"}/> : null}
                        onClick={() => {
                            onSignUpButtonClick(data, { setLoading, notify });
                        }} appearance="primary">
                    Crear cuenta
                </Button></div>
        </>);
    }
};
const loginPostAccountCreation = (data: Credentials, notify: (message: string, type: ToastIntent, description?: string) => void): void => {
    auth.login(data)
        .then((response: CommonResponse) => {
            if(response.success) {
                notify("Iniciaste sesión. Redirigiéndote... ", "success");
                window.location.href = "/";
            }
        })
        .catch((): void => {
            notify("Hubo un error al iniciar sesión.", "warning", "Deberás hacerlo manualmente. ");
        });
};

const onSignUpButtonClick = (data: ISignUpRequest, functions: OnSignUpButtonClickFunctions): void => {
    const { setLoading, notify }: OnSignUpButtonClickFunctions = functions;
    const { username, password }: ISignUpRequest = data;
    setLoading(true);
    users.create(data)
        .then((response: ISignUpResponse): void => {
            setLoading(false);
            console.log(response);
            notify("¡Tu cuenta se creó con éxito!", "success");
            loginPostAccountCreation({ username, password }, notify);
        })
        .catch((error): void => {
            setLoading(false);
            console.log(error);
            notify("Hubo un error al crear tu cuenta. ", "error", "Intentá de nuevo más tarde. ");
        });
};

const SignUpPage = ({ toasterId }: SignUpPageProps): React.JSX.Element => {
    // Valores
    const [ name, setName ]: StateManager<string> = useState<string>("");
    const [ username, setUsername ]: StateManager<string> = useState<string>("");
    const [ bio, setBio ]: StateManager<string> = useState<string>("");
    const [ birth, setBirth ]: StateManager<Date> = useState<Date>(new Date());
    const [ password, setPassword ]: StateManager<string> = useState<string>("");
    const [ repeatPassword, setRepeatPassword ]: StateManager<string> = useState<string>("");
    const [ email, setEmail ]: StateManager<string> = useState<string>("");

    // Validadores
    const [ nameIsValid, setNameValidity ]: StateManager<boolean> = useState<boolean>(false);
    const [ usernameIsValid, setUsernameValidity ]: StateManager<boolean> = useState<boolean>(false);
    const [ bioIsValid, setBioValidity ]: StateManager<boolean> = useState<boolean>(true);
    const [ birthIsValid, setBirthValidity ]: StateManager<boolean> = useState<boolean>(true);
    const [ passwordValidity, setPasswordValidity ]: StateManager<boolean> = useState<boolean>(false);
    const [ passwordsAreEqual, setPasswordsEquality ]: StateManager<boolean> = useState<boolean>(false);
    const [ mailValidity, setMailValidity ]: StateManager<boolean> = useState<boolean>(false);
    const [ allValid, setAllValid ]: StateManager<boolean> = useState<boolean>(false);

    const [ loading, setLoading ]: StateManager<boolean> = useState<boolean>(false);
    const [selectedValue, setSelectedValue] =
        React.useState<SignUpTabValue>("personal");

    const onTabSelect = (event: SelectTabEvent, data: SelectTabData) => {
        setSelectedValue(data.value);
    };

    useEffect((): void => {
        setAllValid(
            nameIsValid && usernameIsValid && bioIsValid && birthIsValid && passwordValidity && passwordsAreEqual && mailValidity
        );
    }, [nameIsValid, usernameIsValid, bioIsValid, birthIsValid, passwordValidity, passwordsAreEqual, mailValidity]);

    const { dispatchToast } = useToastController(toasterId);
    const notify = (message: string, type: ToastIntent, description?: string) =>
        dispatchToast(
            <Toast>
                <ToastTitle>{message}</ToastTitle>
                { description && <ToastBody subtitle="Subtitle">{ description }</ToastBody> }
            </Toast>,
            { intent: type }
        );


    const signUpData: ISignUpRequest = { username, bio, password, name, birth, email };
    const PersonalTabContent: React.JSX.Element = tabs.personal({ name, username, birth },{ setName, setUsername, setBirth, setBirthValidity, setNameValidity, setUsernameValidity, setSelectedValue });
    const AccountTabContent: React.JSX.Element = tabs.account({ email, password, repeatPassword },{ setEmail, setMailValidity, setPassword, setPasswordValidity, setRepeatPassword, setPasswordsEquality, setSelectedValue });
    const MoreTabContent: React.JSX.Element = tabs.more({ bio, allValid, loading, data: signUpData },{ setBio, setBioValidity, onSignUpButtonClick, setLoading, notify });


    return (<div className={"main"}>
        <br/>
        <Title2 align={"center"}>Crear cuenta</Title2>
        <br/><br/>
        <TabList selectedValue={selectedValue} onTabSelect={onTabSelect}>
            <Tab id="PersonalTabContent" value="personal">
                Información Personal
            </Tab>
            <Tab id="AccountTabContent" value="account">
                Cuenta
            </Tab>
            <Tab id="MoreTabContent" value="more">
                Más
            </Tab>
        </TabList>
        <div className="tabContent">
            <br/>
            { selectedValue === "personal" && PersonalTabContent }
            { selectedValue === "account" && AccountTabContent }
            { selectedValue === "more" && MoreTabContent }
        </div>
    </div>)
};
export default SignUpPage;