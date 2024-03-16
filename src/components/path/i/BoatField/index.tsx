import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import {IBoatFieldProps} from "./defs";
import {useStyles} from "./styles";
import {Field, mergeClasses} from "@fluentui/react-components";
import BoatSelector from "../../../boat/BoatSelector";
import {IBoat} from "../../../../data/models/boat";
import * as path from "../../../../data/actions/path";
import {CommonResponse} from "../../../../data/utils";
import {FieldValidationStatus} from "../../../user/user-page/RoleSelector/defs";

const LANG_PATH: string = "components.paths.i.BoatField";
const strings = {
    label: "label"
};
const BoatField = ({id, value, editable, onChange }: IBoatFieldProps): React.JSX.Element => {
    const {t: translate} = useTranslation();
    const t = (key: string): string => translate(LANG_PATH + "." + key);
    const styles = useStyles();
    const [ message, setMessage ] = useState<string>("");
    const [ state, setState ] = useState<FieldValidationStatus>("none");

    const handler = (newValue: IBoat): void => {
        path.edit(id, { boat: newValue._id })
            .then((response: CommonResponse): void => {
                onChange(newValue);
                setMessage(translate("status.updated"));
                setState("success");
            })
            .catch(err => {
                console.error(err);
                setMessage(translate("err.couldntUpdate"));
                setState("error");
            })
            .finally((): void => {});
    };

    return (<div className={mergeClasses(styles.root, "jBar")}>
        <div className="l">{t(strings.label)}</div>
        <div className="r">
            { !editable && value.name }
            { editable && <Field
                validationMessage={message}
                validationState={state}>
                <BoatSelector selected={value} onSelect={handler} />
            </Field> }
        </div>
    </div>);
};
export default BoatField;