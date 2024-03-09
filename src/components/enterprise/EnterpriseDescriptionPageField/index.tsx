import {IEnterpriseDescriptionPageFieldProps} from "./defs";
import React, {useState} from "react";
import {StateManager} from "../../../page/SignUpPage/defs";
import EditableField from "../../basic/EditableField";
import { IEditableFieldValidationStatus } from "../../basic/EditableField/defs";
import {CommonResponse} from "../../../data/utils";
import {Role} from "../../../data/models/user";
import * as enterprises from "../../../data/actions/enterprise";

const EnterpriseDescriptionPageField = ({me, description: n, onUpdate, author, id }: IEnterpriseDescriptionPageFieldProps): React.JSX.Element => {

    const [ description, setDescription ]: StateManager<string> = useState<string>(n);
    const [ value, setValue ]: StateManager<string> = useState<string>(n);

    const canEdit: boolean = (me !== undefined && me !== null && author !== undefined && author !== null && me.active) && (((me._id === author._id) && (me.role as Role >= 2)) || (me.role === 3));

    const save = (
        validate: (status: IEditableFieldValidationStatus) => void,
        end: (succesfullyUpdated: boolean) => void
    ): void => {
        enterprises.edit(id, { description: value })
            .then((response: CommonResponse): void => {
                if(response.success) {
                    validate({ path: "ok.updated", state: "success", valid: true });
                    setDescription(value);
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
        (value: string): IEditableFieldValidationStatus =>
        ((x: string): boolean => x.length <= 128 && x.length >= 3)(value)
            ? { path: "", state: "none", valid: true }
            : { path: "err.invalid", state: "error", valid: false };

    return (
        <EditableField
            langPath={"components.enterprise.EnterpriseDescription"}
            initialValue={description}
            editable={canEdit}
            onChange={(value: string): void => {setValue(value)}}
            onUpdate={(value: string): void => {
                onUpdate(value);
                setDescription(value);
            }}
            validator={validate}
            onSaving={save}
            onValid={(_value: string): void => {}}
            onInvalid={(_value: string): void => {}}
        />
    );
};
export default EnterpriseDescriptionPageField;