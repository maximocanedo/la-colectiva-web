import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import {IRegionFieldProps} from "./defs";
import {useStyles} from "./styles";
import {Field, Input} from "@fluentui/react-components";
import {FieldValidationStatus} from "../../../user/user-page/RoleSelector/defs";
import RegionSelector from "../../../region/RegionSelector";
import {IRegion} from "../../../../data/models/region";

const LANG_PATH: string = "components.docks.c.RegionField";
const strings = {
    label: "label",
    noValid: "noValid"
};
const RegionField = ({ value, onChange, onCheck }: IRegionFieldProps): React.JSX.Element => {
    const {t: translate} = useTranslation();
    const t = (key: string): string => translate(LANG_PATH + "." + key);
    const styles = useStyles();

    const [ message, setMessage ] = useState<string>("");
    const [ state, setState ] = useState<FieldValidationStatus>("none");

    const validate = (x: IRegion | null): boolean => x !== null;
    const changeEv = (newValue: IRegion): void => {
        const isValid: boolean = validate(newValue);
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
            <RegionSelector selected={value} onSelect={changeEv} />
        </Field>
    );
};
export default RegionField;