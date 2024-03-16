import { Field } from "@fluentui/react-components";
import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import {IEnterpriseFieldProps} from "./defs";
import {useStyles} from "./styles";
import {FieldValidationStatus} from "../../../../components/user/user-page/RoleSelector/defs";
import EnterpriseSelector from "../../../../components/enterprise/EnterpriseSelector";
import {IEnterprise} from "../../../../data/models/enterprise";

const LANG_PATH: string = "components.boat.EnterpriseField";
const strings = {
    label: "label"
};
const EnterpriseField = ({ value, onChange, onCheck }: IEnterpriseFieldProps): React.JSX.Element => {
    const {t: translate} = useTranslation();
    const t = (key: string): string => translate(LANG_PATH + "." + key);
    const styles = useStyles();

    const [ message, setMessage ] = useState<string>("");
    const [ state, setState ] = useState<FieldValidationStatus>("none");

    const onSelect = (data: IEnterprise | null): void => {
        if(data === null) onCheck(false);
        else {
            onChange(data);
            onCheck(true);
        }
    }

    return (<Field
                label={t(strings.label)}
                validationMessage={message}
                validationState={state}
                className={styles.root}>
                <EnterpriseSelector selected={value} onSelect={onSelect} />
            </Field>);
};
export default EnterpriseField;