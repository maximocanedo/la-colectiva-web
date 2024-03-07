import {RegionNameProps} from "./defs";
import React, {useState} from "react";
import {StateManager} from "../../../page/SignUpPage/defs";
import EditableField from "../../basic/EditableField";
import { IEditableFieldValidationStatus } from "../../basic/EditableField/defs";
import * as regions from "../../../data/actions/region";
import {CommonResponse} from "../../../data/utils";
import {Role} from "../../../data/models/user";

const RegionName = ({me, name: n, onUpdate, author, id, type}: RegionNameProps): React.JSX.Element => {

    const [ name, setName ]: StateManager<string> = useState<string>(n);
    const [ value, setValue ]: StateManager<string> = useState<string>(n);

    const canEdit: boolean = (me !== undefined && me !== null && author !== undefined && author !== null && me.active === true) && (((me._id === author._id) && (me.role as Role >= 2)) || (me.role === 3));

    const save = (
        validate: (status: IEditableFieldValidationStatus) => void,
        end: (succesfullyUpdated: boolean) => void
    ): void => {
        regions.edit(id, { name: value })
            .then((response: CommonResponse): void => {
                console.log(response);
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
        (value: string): IEditableFieldValidationStatus =>
        ((x: string): boolean => x.length <= 48 && x.length >= 3)(value)
            ? { path: "", state: "none", valid: true }
            : { path: "err.invalid", state: "error", valid: false };

    return (
        <EditableField
            langPath={"components.region.RegionName"}
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
export default RegionName;