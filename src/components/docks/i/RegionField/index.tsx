import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import { FieldValidationStatus } from "../../../user/user-page/RoleSelector/defs";
import {IRegionFieldProps} from "./defs";
import {useStyles} from "./styles";
import RegionSelector from "../../../region/RegionSelector";
import {Field} from "@fluentui/react-components";
import {IRegion} from "../../../../data/models/region";
import * as docks from "../../../../data/actions/dock";
import {CommonResponse} from "../../../../data/utils";

const LANG_PATH: string = "components.docks.i.RegionField";
const strings = {
    label: "label",
    ok: "ok"
};
const RegionField = ({ value, onChange, editable, id }: IRegionFieldProps): React.JSX.Element => {
    const {t: translate} = useTranslation();
    const t = (key: string): string => translate(LANG_PATH + "." + key);
    const styles = useStyles();
    const [ message, setMessage ] = useState<string>("");
    const [ state, setState ] = useState<FieldValidationStatus>("none");
    const [ saving, setSavingState ] = useState<boolean>(false);

    const save = (selected: IRegion): void => {
        setSavingState(true);
        docks.edit(id, { region: selected._id })
            .then((response: CommonResponse): void => {
                onChange(selected);
                setMessage(t(strings.ok));
                setState("success");
            })
            .catch(err => console.error(err))
            .finally((): void => {
               setSavingState(false);
            });
    };

    return (<div className={styles.root + " jBar"}>
        <div className="l">
            <span>{t(strings.label)}</span>
        </div>
        <div className="r flex-edtbl-dt">
            {!editable && value.name}
            {editable && <Field
                validationState={state}
                validationMessage={message}>
                <RegionSelector selected={value} onSelect={save}/>
            </Field>}
        </div>
    </div>);
};
export default RegionField;