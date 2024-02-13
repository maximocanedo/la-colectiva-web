import React, {FormEventHandler, useState} from "react";
import {Field, FieldProps, Input} from "@fluentui/react-components";
import {useTranslation, UseTranslationResponse} from "react-i18next";

interface NameFieldProps extends FieldProps {
    value: string;
    onValueChange: (value: string) => void;
    onValidationChange: (error: boolean) => void;
}
const NameField = (props: NameFieldProps): React.JSX.Element => {
    const { t }: UseTranslationResponse<"translation", undefined> = useTranslation();
    const [ name, setName ] = useState<string>(props.value);
    const [ vm, setVM ] = useState<string>("");
    const [ vs, setVS ] = useState<"error" | "warning" | "success" | "none" | undefined>(undefined);

    return <Field
        label={t('components.user.signup.NameField.label')}
        validationMessage={vm}
        validationState={vs}
        {...props}
    >
        <Input
            maxLength={24}
            minLength={3}
            value={name}
            onChange={(ev) => {
                const e: string = ev.target.value;
                setName(ev.target.value);
                props.onValueChange(e);
                if(e.length < 3) {
                    setVM(t('components.user.signup.NameField.err.atLeastThree'));
                    setVS("error");
                    props.onValidationChange(false);
                } else if(e.length > 24) {
                    setVM(t('components.user.signup.NameField.err.upToTwentyFour'));
                    setVS("error");
                    props.onValidationChange(false);
                } else {
                    setVM("");
                    setVS(undefined);
                    props.onValidationChange(true);
                }
        }} />
    </Field>
};
export default NameField;