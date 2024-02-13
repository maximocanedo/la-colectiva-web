import React, {FormEventHandler, useState} from "react";
import {Field, FieldProps, Input, Textarea} from "@fluentui/react-components";
import {useTranslation, UseTranslationResponse} from "react-i18next";

interface BioFieldProps extends FieldProps {
    value: string;
    onValueChange: (value: string) => void;
    onValidationChange: (error: boolean) => void;
}
const BioField = (props: BioFieldProps): React.JSX.Element => {
    const { t }: UseTranslationResponse<"translation", undefined> = useTranslation();
    const [ value, setValue ] = useState<string>(props.value);
    const [ vm, setVM ] = useState<string>("");
    const [ vs, setVS ] = useState<"error" | "warning" | "success" | "none" | undefined>(undefined);

    return <Field
        label={t('components.user.signup.BioField.label')}
        validationMessage={vm}
        validationState={vs}
        {...props}
    >
        <Textarea
            value={value}
            maxLength={48}
            onChange={(ev) => {
                const e: string = ev.target.value;
                setValue(e);
                props.onValueChange(e);
                if(e.length > 48) {
                    setVM(t('components.user.signup.BioField.err.upToFourtyEight'));
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
export default BioField;