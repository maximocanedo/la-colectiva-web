import React, {useState} from "react";
import NameField from "../components/user/signup/NameField";
import UsernameField from "../components/user/signup/UsernameField";

const SignUpPage = (): React.JSX.Element => {
    const [ name, setName ] = useState<string>("");
    const [ nameIsValid, setNameIsValid ] = useState<boolean>(false);
    const [ username, setUsername ] = useState<string>("");
    const [ usernameIsValid, setUsernameIsValid ] = useState<boolean>(false);
    return (<div className={"main"}>
        <NameField onValueChange={val => setName(val) } onValidationChange={e => setNameIsValid(e)} />
        <br/>
        <UsernameField onValueChange={val => setUsername(val) } onValidationChange={ x => setUsernameIsValid(x) } />
    </div>)
};
export default SignUpPage;