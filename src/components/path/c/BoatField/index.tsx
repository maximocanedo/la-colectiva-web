import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import {IBoatFieldProps} from "./defs";
import {useStyles} from "./styles";
import {FieldValidationStatus} from "../../../user/user-page/RoleSelector/defs";
import {Field, Input, InputOnChangeData} from "@fluentui/react-components";
import BoatSelector from "../../../boat/BoatSelector";
import {IBoat} from "../../../../data/models/boat";

const LANG_PATH: string = "components.paths.c.BoatField";
const strings = {
    label: "label",
    err: {
        nul: "err.nul"
    }
};
const BoatField = ({ value, onChange, onCheck }: IBoatFieldProps): React.JSX.Element => {
    const {t: translate} = useTranslation();
    const t = (key: string): string => translate(LANG_PATH + "." + key);
    const styles = useStyles();
    const [ message, setMessage ] = useState<string>("");
    const [ state, setState ] = useState<FieldValidationStatus>("none");
    const n = (m: string, s: FieldValidationStatus): void => {
        setMessage(m);
        setState(s);
    };
    const handler = (newValue: IBoat | null): void => {
        onChange(newValue);
        const isValid: boolean = newValue !== null;
        if(!isValid)
            n(t(strings.err.nul), "error");
        else n("", "none");
        onCheck(isValid);
    };

    return (
        <Field
            label={t(strings.label)}
            validationMessage={message}
            validationState={state}
            className={styles.root}>
            <BoatSelector selected={value} onSelect={handler} />
        </Field>
    );
};
export default BoatField;