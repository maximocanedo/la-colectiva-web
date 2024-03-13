import {IBoatNamePageFieldProps} from "./defs";
import React, {useState} from "react";
import {StateManager} from "../../../page/SignUpPage/defs";
import EditableField from "../../basic/EditableField";
import { IEditableFieldValidationStatus } from "../../basic/EditableField/defs";
import * as boats from "../../../data/actions/boat";
import {CommonResponse} from "../../../data/utils";
import {Role} from "../../../data/models/user";
import {log} from "../../page/definitions";

const BoatNamePageField = ({me, name: n, onUpdate, author, id }: IBoatNamePageFieldProps): React.JSX.Element => {

    log("BoatNamePageField");
    const [ name, setName ]: StateManager<string> = useState<string>(n);
    const [ value, setValue ]: StateManager<string> = useState<string>(n);

    const canEdit: boolean = (me !== undefined && me !== null && author !== undefined && author !== null && me.active) && (((me._id === author._id) && (me.role as Role >= 2)) || (me.role === 3));

    const save = (
        validate: (status: IEditableFieldValidationStatus) => void,
        end: (succesfullyUpdated: boolean) => void
    ): void => {
        boats.edit(id, { name: value })
            .then((response: CommonResponse): void => {
                console.log(response);
                if(response.success) {
                    validate({ path: "ok.updated", state: "success", valid: true });
                    setName(value);
                    end(true);
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
        ((x: string): boolean => x.length <= 48 && x.length >= 3)(value)
            ? { path: "", state: "none", valid: true }
            : { path: "err.invalid", state: "error", valid: false };

    return (
        <EditableField
            langPath={"components.boat.BoatNamePageField"}
            initialValue={name}
            editable={canEdit}
            onChange={(value: string): void => {setValue(value)}}
            onUpdate={(value: string): void => {
                onUpdate(value);
                setName(value);
            }}
            validator={validate}
            onSaving={save}
            onValid={(_value: string): void => {}}
            onInvalid={(_value: string): void => {}}
        />
    );
};
export default BoatNamePageField;