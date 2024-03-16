import React, {FormEventHandler, useState} from "react";
import {Field, FieldProps, Input} from "@fluentui/react-components";
import { DatePicker } from "@fluentui/react-datepicker-compat";
import {useTranslation, UseTranslationResponse} from "react-i18next";
import {log} from "../../page/definitions";

interface BirthFieldProps extends FieldProps {
    value: Date;
    onValueChange: (value: Date) => void;
    onValidationChange: (error: boolean) => void;
}
const BirthField = (props: BirthFieldProps): React.JSX.Element => {
    log("BirthField");
    const { t }: UseTranslationResponse<"translation", undefined> = useTranslation();
    const [ value, setValue ] = useState<Date>(props.value);
    const [ vm, setVM ] = useState<string>("");
    const [ vs, setVS ] = useState<"error" | "warning" | "success" | "none" | undefined>(undefined);

    return <Field
        label={t('components.user.signup.BirthField.label')}
        validationMessage={vm}
        validationState={vs}
        {...props}
    >
        <DatePicker
            value={value}
            placeholder={t('components.user.signup.BirthField.ok.select')}
            onSelectDate={(date: Date | null | undefined): void => {
                if(date !== null && typeof date !== 'undefined') {
                    props.onValueChange(date as Date);
                    setValue(date as Date);
                    props.onValidationChange(true);
                } else {
                    props.onValidationChange(false);
                }
            }}
        />
    </Field>
};
export default BirthField;