import {Field, Input} from "@fluentui/react-components";
import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {INameFieldProps} from "./defs";
import {useStyles} from "./styles";
import {FieldValidationStatus} from "../../../../components/user/user-page/RoleSelector/defs";

const LANG_PATH: string = "components.boat.NameField";
const strings = {
    placeholder: "placeholder",
    label: "label",
    err: "err"
};
const NameField = ({ value, onChange, onCheck }: INameFieldProps): React.JSX.Element => {
    const {t: translate} = useTranslation();
    const t = (key: string): string => translate(LANG_PATH + "." + key);
    const styles = useStyles();


    const [ message, setMessage ] = useState<string>("");
    const [ state, setState ] = useState<FieldValidationStatus>("none");

    useEffect((): void => {
        const validate = (x: string): boolean => {
            x = x.trim();
            return x.length >= 3 && x.length <= 48;
        };
        const isValid: boolean = validate(value);
        setState(
            value.trim().length === 0 ? "none" : (isValid ? "none" : "error")
        );
        setMessage(
            value.trim().length === 0 ? "" : (isValid ? "" : t(strings.err))
        );
        onCheck(isValid);
    }, [ value ]);

    const onValueChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const newValue: string = e.target.value;
        onChange(newValue);
    };

    return (<Field
                validationMessage={message}
                validationState={state}
                label={t(strings.label)}
                className={styles.root}>
                <Input
                    type={"text"}
                    placeholder={t(strings.placeholder)}
                    value={value}
                    onChange={onValueChange} />
            </Field>);
};
export default NameField;