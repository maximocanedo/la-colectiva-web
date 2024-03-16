import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {IBoatEnterprisePageFieldProps} from "./defs";
import {IEnterprise} from "../../../data/models/enterprise";
import EnterpriseSelector from "../../enterprise/EnterpriseSelector";
import {Edit16Filled} from "@fluentui/react-icons";
import {Button, Spinner} from "@fluentui/react-components";
import * as boats from "../../../data/actions/boat";
import {CommonResponse} from "../../../data/utils";
import {log} from "../../page/definitions";

const LANG_PATH: string = "components.boat.BoatEnterprisePageField";
const strings = {
    label: "label",
    st: {
        saving: "st.saving",
        save: "st.save",
        cancel: "st.cancel",
        close: "st.close"
    }
};
const BoatEnterprisePageField = ({ initial, onUpdate, editable, id }: IBoatEnterprisePageFieldProps): React.JSX.Element => {
    const { t: translate } = useTranslation();
    log("BoatEnterprisePageField");
    const t = (key: string): string => translate(`${LANG_PATH}.${key}`);
    const [ editMode, setEditMode ] = useState<boolean>(false);
    const [ saving, setSavingState ] = useState<boolean>(false);
    const [ updated, setUpdatedState ] = useState<boolean>(false);
    const [ value, setValue ] = useState<IEnterprise>(initial);

    const save = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
        setSavingState(true);
        boats.edit(id, { enterprise: value._id })
            .then((response: CommonResponse): void => {
                if(response.success) {
                    setUpdatedState(true);
                    onUpdate(value);
                    setEditMode(false);
                }
            }).catch(err => console.error(err)).finally((): void => {
                setSavingState(false);
        })
    };
    const cancel = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
        setEditMode(false);
    };

    useEffect(() => {
        setUpdatedState((value._id === initial._id));
    }, [ value ]);

    return (<><div className="jBar">
        <div className="l">{t(strings.label)}</div>
        <div className="r flex-edtbl-dt">
            { !editMode && <span>{initial.name?? ""}</span>}
            { editable && !editMode && <Button onClick={(x) => setEditMode(true)} appearance={"subtle"} size={"small"} icon={<Edit16Filled />} />}

            { editable && editMode && <EnterpriseSelector selected={value} onSelect={x => setValue(x)} /> }
    </div></div>{ editable && editMode && <div className="rtlCell">
                <Button
                    appearance={"primary"}
                    onClick={save}
                    iconPosition={"before"}
                    icon={saving ? <Spinner size={"extra-tiny"}/> : null}
                    disabled={saving || initial._id === value._id}
                >{saving ? t(strings.st.saving) : t(strings.st.save)}
                </Button>
                <Button
                    onClick={cancel}
                    appearance={(updated) ? "primary" : "secondary"}>
                    {(updated) ? t(strings.st.close) : t(strings.st.cancel)}
                </Button>
            </div>}
        </>);
};
export default BoatEnterprisePageField;