import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import {INameFieldProps} from "./defs";
import {useStyles} from "./styles";
import {Field, Input} from "@fluentui/react-components";
import {FieldValidationStatus} from "../../../user/user-page/RoleSelector/defs";

const LANG_PATH: string = "components.docks.c.NameField";
const strings = {
    label: "label",
    noValid: "noValid"
};
const NameField = ({ value, onChange, onCheck }: INameFieldProps): React.JSX.Element => {
    const {t: translate} = useTranslation();
    const t = (key: string): string => translate(LANG_PATH + "." + key);
    const styles = useStyles();

    const [ message, setMessage ] = useState<string>("");
    const [ state, setState ] = useState<FieldValidationStatus>("none");

    const validate = (str: string): boolean => str.length >= 3 && str.length <= 48;
    const changeEv = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const newValue: string = e.target.value;
        const isValid: boolean = validate(newValue);
        onChange(newValue);
        onCheck(isValid);
        const isEmpty: boolean = !isValid && newValue.trim() === "";
        setMessage(isEmpty || isValid ? "" : t(strings.noValid));
        setState(isEmpty || isValid ? "none" : "error");
    };

    return (
        <Field
            label={t(strings.label)}
            className={styles.root}
            validationMessage={message}
            validationState={state}>
            <Input
                type={"text"}
                minLength={3}
                maxLength={48}
                value={value}
                onChange={changeEv} />
        </Field>
    );
};
export default NameField;