import React, {useState} from "react";
import {Field, FieldProps, Input} from "@fluentui/react-components";
import * as users from "./../../../data/actions/user";
import {useTranslation, UseTranslationResponse} from "react-i18next";
import {log} from "../../page/definitions";

interface UsernameFieldProps extends FieldProps {
    value: string;
    onValueChange: (value: string) => void;
    onValidationChange: (error: boolean) => void;
}
const UsernameField = (props: UsernameFieldProps): React.JSX.Element => {
    log("UsernameField");
    const { t }: UseTranslationResponse<"translation", undefined> = useTranslation();
    const [ value, setValue ] = useState<string>(props.value);
    const [ vm, setVM ] = useState<string>("");
    const [ vs, setVS ] = useState<"error" | "warning" | "success" | "none" | undefined>(undefined);
    return <Field
        label={t('components.user.signup.UsernameField.label')}
        validationMessage={vm}
        validationState={vs}
        {...props}
    >
        <Input
            value={value}
            maxLength={24}
            minLength={3}
            onChange={(ev) => {
                const e: string = ev.target.value;
                setValue(e);
                if(e.match(/^[a-zA-Z0-9_.]{3,24}$/)) {
                    setVM("");
                    setVS(undefined);
                    props.onValidationChange(true);
                } else {
                    props.onValidationChange(false);
                    setVS("error")
                    if(e.indexOf(" ") !== -1)
                        setVM(t('components.user.signup.UsernameField.err.noSpaces'));
                    else
                        setVM(t('components.user.signup.UsernameField.err.lengthNote'));
                }
                props.onValueChange(e);
        }}
        onBlur={(ev) => {
            const e: string = ev.target.value;
            if (e.match(/^[a-zA-Z0-9_.]{3,24}$/)) {
                setVM(t('components.user.signup.UsernameField.err.checkingAvailability'));
                setVS("warning");
                users.usernameExists(e)
                    .then((exists: boolean) => {
                        if (exists) {
                            setVM(t('components.user.signup.UsernameField.err.notAvailable'));
                            setVS("error");
                            props.onValidationChange(false);
                        } else {
                            setVM(t('components.user.signup.UsernameField.ok.available'));
                            setVS("success");
                            props.onValidationChange(true);
                        }
                    })
                    .catch(() => {
                        setVS("warning");
                        setVM(t('components.user.signup.UsernameField.err.unknownErrorWhileValidatingUsernameAvailability'));
                        props.onValidationChange(false);
                    });
            }
        }}


        />
    </Field>
};
export default UsernameField;