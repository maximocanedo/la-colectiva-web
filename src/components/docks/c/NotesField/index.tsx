import React, {ChangeEvent, useState} from "react";
import {useTranslation} from "react-i18next";
import {INotesFieldProps} from "./defs";
import {useStyles} from "./styles";
import {Field, Input, Textarea, TextareaOnChangeData} from "@fluentui/react-components";
import {FieldValidationStatus} from "../../../user/user-page/RoleSelector/defs";

const LANG_PATH: string = "components.docks.c.NotesField";
const strings = {
    label: "label",
    noValid: "noValid"
};
const NotesField = ({ value, onChange, onCheck }: INotesFieldProps): React.JSX.Element => {
    const {t: translate} = useTranslation();
    const t = (key: string): string => translate(LANG_PATH + "." + key);
    const styles = useStyles();

    const [ message, setMessage ] = useState<string>("");
    const [ state, setState ] = useState<FieldValidationStatus>("none");

    const validate = (str: string): boolean => str.length <= 128;
    const changeEv = (_ev: ChangeEvent<HTMLTextAreaElement>, data: TextareaOnChangeData): void => {
        const newValue: string = data.value;
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
            <Textarea
                maxLength={128}
                value={value}
                onChange={changeEv} />
        </Field>
    );
};
export default NotesField;