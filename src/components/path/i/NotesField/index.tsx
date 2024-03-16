import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import {INotesFieldProps} from "./defs";
import {useStyles} from "./styles";
import {IEditableFieldValidationStatus} from "../../../basic/EditableField/defs";
import * as paths from "../../../../data/actions/path";
import {CommonResponse} from "../../../../data/utils";
import EditableField from "../../../basic/EditableField";

const LANG_PATH: string = "components.paths.i.NotesField";
const strings = {
    label: "label"
};
const NotesField = ({ id, formalValue, onUpdate, editable }: INotesFieldProps): React.JSX.Element => {
    const {t: translate} = useTranslation();
    const t = (key: string): string => translate(LANG_PATH + "." + key);
    const styles = useStyles();

    const [ value, setValue ] = useState<string>(formalValue);

    const save = (
        validate: (status: IEditableFieldValidationStatus) => void,
        end: (succesfullyUpdated: boolean) => void
    ): void => {
        paths.edit(id, { notes: value })
            .then((response: CommonResponse): void => {
                if(response.success) {
                    validate({ path: "ok.updated", state: "success", valid: true });
                    onUpdate(value);
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
            ((x: string): boolean => x.length <= 256 && x.length >= 1)(y)
                ? { path: "", state: "none", valid: true }
                : { path: "err.invalid", state: "error", valid: false };

    return (<EditableField
        langPath={LANG_PATH}
        initialValue={formalValue}
        editable={editable}
        onChange={(x: string): void => {setValue(x)}}
        onUpdate={(x: string): void => {
            onUpdate(x);
        }}
        validator={validate}
        onSaving={save}
        onValid={(_value: string): void => {}}
        onInvalid={(_value: string): void => {}} />);
};
export default NotesField;