import React, {useState} from "react";
import {Field, FieldProps, Input} from "@fluentui/react-components";
import {useTranslation, UseTranslationResponse} from "react-i18next";
import {log} from "../../page/definitions";

interface MailFieldProps extends FieldProps {
    value: string;
    onValueChange: (value: string) => void;
    onValidationChange: (error: boolean) => void;
}
const MailField = (props: MailFieldProps): React.JSX.Element => {
    log("MailField");
    const { t }: UseTranslationResponse<"translation", undefined> = useTranslation();
    const [ value, setValue ] = useState<string>(props.value);
    const [ vm, setVM ] = useState<string>("");
    const [ vs, setVS ] = useState<"error" | "warning" | "success" | "none" | undefined>(undefined);

    return <Field
        label={t('components.user.signup.MailField.label')}
        validationMessage={vm}
        validationState={vs}
        {...props}
    >
        <Input
            maxLength={64}
            value={value}
            onChange={(ev) => {
                const email: string = ev.target.value;
                setValue(email);
                props.onValueChange(email);

                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

                if (!emailRegex.test(email)) {
                    setVM(t('components.user.signup.MailField.err.nonValid'));
                    setVS("error");
                    props.onValidationChange(false);
                } else {
                    setVM("");
                    setVS("none");
                    props.onValidationChange(true);
                }
            }}
        />
    </Field>
};
export default MailField;