import React, {useEffect, useState} from "react";
import {Field, Input} from "@fluentui/react-components";
import {useTranslation, UseTranslationResponse} from "react-i18next";
import {StateManager} from "../../../../page/SignUpPage/defs";
import {IdentifierFieldProps, IdentifierType} from "./defs";

const IdentifierField = (props: IdentifierFieldProps): React.JSX.Element => {
    const { t }: UseTranslationResponse<"translation", undefined> = useTranslation();
    const [ value, setValue ]: StateManager<string> = useState<string>(props.value);
    const [ vm, setVM ]: StateManager<string> = useState<string>("");
    const [ vs, setVS ]: StateManager<"error" | "warning" | "success" | "none" | undefined> = useState<"error" | "warning" | "success" | "none" | undefined>(undefined);
    const [ type, setType ]: StateManager<IdentifierType> = useState<IdentifierType>("empty");

    useEffect((): void => {
        const isMail = (x: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(x);
        const isUsername = (x: string): boolean => /^[a-zA-Z0-9_.]{3,24}$/.test(x);
        const isEmpty = (x: string): boolean => x.trim() === "";
        setType(
            (isMail(value) && "email") ||
            (isUsername(value) && "username") ||
            (isEmpty(value) && "empty") || "neither"
        );
    }, [ value ]);
    
    useEffect((): void => {
        props.onTypeChange(type);
    }, [props, type]);

    useEffect((): void => {
        props.onValueChange(value);
    }, [ value, props ]);

    const onFieldChange = (ev: React.ChangeEvent<HTMLInputElement>): void => {
        const e: string = ev.target.value;
        setValue(e);
    };
    const onFieldBlur = (_ev: React.FocusEvent<HTMLInputElement, Element>): void => {
        if(type === "neither") {
            setVM(t('components.user.login.IdentifierField.err.invalidIdentifier'));
            setVS("error");
        }
    };

    const label: string = (type === "email" && t('components.user.login.IdentifierField.label.email'))
    || (type === "username" && t('components.user.login.IdentifierField.label.username'))
    || t('components.user.login.IdentifierField.label.neither');

    return (<Field
        label={label}
        validationMessage={vm}
        validationState={vs}
        {...props}
    >
        <Input
            value={value}
            maxLength={24}
            minLength={3}
            onChange={onFieldChange}
            onBlur={onFieldBlur}
        />
    </Field>);
};
export default IdentifierField;