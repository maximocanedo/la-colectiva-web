import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import {INotesFieldProps} from "./defs";
import {useStyles} from "./styles";
import {FieldValidationStatus} from "../../../user/user-page/RoleSelector/defs";
import {Field, Input, InputOnChangeData, Textarea, TextareaOnChangeData} from "@fluentui/react-components";

const LANG_PATH: string = "components.paths.c.NotesField";
const strings = {
    label: "label",
    err: {
        minlength: "err.minlength",
        maxlength: "err.maxlength"
    }
};
const NotesField = ({ value, onChange, onCheck }: INotesFieldProps): React.JSX.Element => {
    const {t: translate} = useTranslation();
    const t = (key: string): string => translate(LANG_PATH + "." + key);
    const styles = useStyles();
    const [ message, setMessage ] = useState<string>("");
    const [ state, setState ] = useState<FieldValidationStatus>("none");
    const n = (m: string, s: FieldValidationStatus): void => {
        setMessage(m);
        setState(s);
    };
    const handler = (_e: any, d: TextareaOnChangeData): void => {
        const newValue: string = d.value as string;
        onChange(newValue);
        const isValid: boolean = newValue.trim().length >= 1 && newValue.trim().length <= 256;
        if(newValue.trim().length < 1 && newValue.trim().length > 0)
            n(t(strings.err.minlength), "error");
        else if(newValue.trim().length > 256)
            n(t(strings.err.maxlength), "error");
        else n("", "none");
        onCheck(isValid);
    };

    return (
        <Field
            label={t(strings.label)}
            validationMessage={message}
            validationState={state}
            className={styles.root}>
            <Textarea content={value} minLength={1} maxLength={256} onChange={handler} />
        </Field>
    );
};
export default NotesField;