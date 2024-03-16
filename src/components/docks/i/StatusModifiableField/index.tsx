import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import {IStatusModifiableFieldProps} from "./defs";
import {useStyles} from "./styles";
import {Field, mergeClasses} from "@fluentui/react-components";
import StatusField from "../StatusField";
import {DockPropertyStatus} from "../../../../data/models/dock";
import {FieldValidationStatus} from "../../../user/user-page/RoleSelector/defs";
import * as docks from "../../../../data/actions/dock";

const LANG_PATH: string = "components.docks.i.StatusModifiableField";
const strings = {
    label: "label",
    updated: "updated",
    couldntUpdate: "couldntUpdate"
};
const StatusModifiableField = ({ value, onUpdate, editable, id }: IStatusModifiableFieldProps): React.JSX.Element => {
    const {t: translate} = useTranslation();
    const t = (key: string): string => translate(LANG_PATH + "." + key);
    const styles = useStyles();
    const [ m, setM ] = useState<string>("");
    const [ s, setS ] = useState<FieldValidationStatus>("none");
    const text: string[] = [
        "private",
        "public",
        "business",
        "government",
        "neighbourhood",
        "other",
        "unlisted"
    ];
    const gt = (i: DockPropertyStatus): string => translate(`dockStatus.${text[i]}`);
    const save = (x: DockPropertyStatus): void => {
        docks.edit(id, { status: x })
            .then((_res): void => {
                onUpdate(x);
                setM(t(strings.updated));
                setS("success");
            })
            .catch(err => {
                console.error(err);
                setM(t(strings.couldntUpdate));
                setS("error");
            })
            .finally((): void => {

            });
    };

    return (<div className={mergeClasses(styles.root, "jBar")}>
        <div className="l">{t(strings.label)}</div>
        <div className="r">
            { !editable && <span>{gt(value)}</span>}
            { editable && <Field validationMessage={m} validationState={s}>
                <StatusField value={value} onChange={save} />
            </Field>}
        </div>
    </div>);
};
export default StatusModifiableField;