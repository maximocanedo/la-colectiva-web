import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {IMatFieldProps} from "./defs";
import {useStyles} from "./styles";
import {FieldValidationStatus} from "../../../../components/user/user-page/RoleSelector/defs";
import {Field, Input} from "@fluentui/react-components";
import * as boats from "../../../../data/actions/boat";

const LANG_PATH: string = "components.boat.MatField";
const strings = {
    label: "label",
    placeholder: "placeholder",
    ok: "ok",
    err: {
        chars: "err.chars",
        exists: "err.exists"
    }
};
const MatField = ({ value, onChange, onCheck }: IMatFieldProps): React.JSX.Element => {
    const {t: translate} = useTranslation();
    const t = (key: string): string => translate(LANG_PATH + "." + key);
    const styles = useStyles();


    const [ message, setMessage ] = useState<string>("");
    const [ state, setState ] = useState<FieldValidationStatus>("none");

    const validate = (): void => {
        const v = (x: string): boolean => {
            x = x.trim();
            return x.length >= 2 && x.length <= 16;
        };
        if(v(value)) {
            boats.existsByMat(value)
                .then((exists: boolean): void => {
                    if(exists) {
                        setState("error");
                        setMessage(t(strings.err.exists));
                        onCheck(false);
                    } else {
                        setState("success");
                        setMessage(t(strings.ok));
                        onCheck(true);
                    }
                })
                .catch(err => console.error(err))
                .finally((): void => {

                });
        } else {
            setState(
                value.trim().length === 0 ? "none" : ("error")
            );
            setMessage(
                value.trim().length === 0 ? "" : (t(strings.err.chars))
            );
            onCheck(false);

        }
    };

    const onValueChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const newValue: string = e.target.value;
        onCheck(false);
        onChange(newValue.trim());
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
            onBlur={() => validate()}
            onChange={onValueChange} />
    </Field>);
};
export default MatField;