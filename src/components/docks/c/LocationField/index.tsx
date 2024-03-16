import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import {ILocationFieldProps} from "./defs";
import {useStyles} from "./styles";
import {Field, Input} from "@fluentui/react-components";
import {FieldValidationStatus} from "../../../user/user-page/RoleSelector/defs";
import PlaceSelector from "../../../maps/PlaceSelector";

const LANG_PATH: string = "components.docks.c.LocationField";
const strings = {
    label: "label",
    noValid: "noValid"
};
const LocationField = ({ value, onChange, onCheck }: ILocationFieldProps): React.JSX.Element => {
    const {t: translate} = useTranslation();
    const t = (key: string): string => translate(LANG_PATH + "." + key);
    const styles = useStyles();

    const [ message, setMessage ] = useState<string>("");
    const [ state, setState ] = useState<FieldValidationStatus>("none");

    const changeEv = (newValue: [ number, number ]): void => {
        const isValid: boolean = true;
        onChange(newValue);
        onCheck(isValid);
        setMessage(isValid ? "" : t(strings.noValid));
        setState(isValid ? "none" : "error");
    };

    return (
        <Field
            label={t(strings.label)}
            className={styles.root}
            validationMessage={message}
            validationState={state}>
            <PlaceSelector value={value} onChange={changeEv} />
        </Field>
    );
};
export default LocationField;