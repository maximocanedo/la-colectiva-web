import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {INameFieldProps} from "./defs";
import EditableField from "../../../basic/EditableField";
import {IEditableFieldValidationStatus} from "../../../basic/EditableField/defs";
import * as docks from "../../../../data/actions/dock";
import {CommonResponse} from "../../../../data/utils";

const LANG_PATH: string = "components.docks.i.NameField";
const strings = { };
const NameField = ({ id, name: n, onUpdate, editable }: INameFieldProps): React.JSX.Element => {
    const {t: translate} = useTranslation();
    const t = (key: string): string => translate(LANG_PATH + "." + key);
    const [ name, setName ] = useState<string>(n);
    const [ value, setValue ] = useState<string>(n);
    useEffect(() => {
        setName(n);
        console.log({n, name});
    }, [ n ]);
    const save = (
        validate: (status: IEditableFieldValidationStatus) => void,
        end: (succesfullyUpdated: boolean) => void
    ): void => {
        docks.edit(id, { name: value })
            .then((response: CommonResponse): void => {
                if(response.success) {
                    validate({ path: "ok.updated", state: "success", valid: true });
                    setName(value);
                } else {
                    validate({ path: "err.couldntUpdate", state: "error", valid: false });
                    end(false);
                }
                end(true);
            })
            .catch((err): void => {
                validate({ path: "err.couldntUpdate", state: "error", valid: false });
                end(false);
            });
    };

    const validate =
        (y: string): IEditableFieldValidationStatus =>
            ((x: string): boolean => x.length <= 48 && x.length >= 3)(y)
                ? { path: "", state: "none", valid: true }
                : { path: "err.invalid", state: "error", valid: false };

    return (<EditableField
        langPath={LANG_PATH}
        initialValue={name}
        editable={editable}
        onChange={(x: string): void => {setValue(x)}}
        onUpdate={(x: string): void => {
            onUpdate(x);
            setName(x);
        }}
        validator={validate}
        onSaving={save}
        onValid={(_value: string): void => {}}
        onInvalid={(_value: string): void => {}} />);
};
export default NameField;