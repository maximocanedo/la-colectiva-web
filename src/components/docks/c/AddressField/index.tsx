import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import {IAddressFieldProps} from "./defs";
import {useStyles} from "./styles";
import {Field, Input} from "@fluentui/react-components";
import {FieldValidationStatus} from "../../../user/user-page/RoleSelector/defs";

const LANG_PATH: string = "components.docks.c.AddressField";
const strings = {
    label: "label",
    noValid: "noValid"
};
const AddressField = ({ value, onChange, onCheck }: IAddressFieldProps): React.JSX.Element => {
    const {t: translate} = useTranslation();
    const t = (key: string): string => translate(LANG_PATH + "." + key);
    const styles = useStyles();

    const [ message, setMessage ] = useState<string>("");
    const [ state, setState ] = useState<FieldValidationStatus>("none");

    const validate = (x: number): boolean => x >= 0;
    const changeEv = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const newValue: number = parseInt(e.target.value);
        const isValid: boolean = validate(newValue);
        onChange(newValue);
        onCheck(isValid);
        setMessage(isValid ? "" : t(strings.noValid));
        setState(isValid ? "none" : "error");
    };

    return (
        <Field
            label={t(strings.label)}
            className={styles.root}
            validationMessage={message}
            validationState={state}>
            <Input
                type={"number"}
                min={0}
                value={value + ""}
                onChange={changeEv} />
        </Field>
    );
};
export default AddressField;