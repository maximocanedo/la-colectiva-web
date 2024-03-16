import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {IAddressFieldProps} from "./defs";
import {useStyles} from "./styles";
import {Edit16Filled} from "@fluentui/react-icons";
import {Button, Field, Input, Spinner} from "@fluentui/react-components";
import {FieldValidationStatus} from "../../../user/user-page/RoleSelector/defs";
import * as docks from "../../../../data/actions/dock";

const LANG_PATH: string = "components.docks.i.AddressField";
const strings = {
    label: "label"
};
const AddressField = ({ value: content, onUpdate, id, editable }: IAddressFieldProps): React.JSX.Element => {
    const {t: translate} = useTranslation();
    const t = (key: string): string => translate(LANG_PATH + "." + key);
    const styles = useStyles();

    const [ editMode, setEditMode ] = useState<boolean>(false);
    const [ address, setAddress ] = useState<number>(content);
    const [ value, setValue ] = useState<number>(content);
    const [ message, setMessage ] = useState<string>("");
    const [ state, setState ] = useState<FieldValidationStatus>("none");
    const [ saving, setSavingState ] = useState<boolean>(false);
    const [ updated, setUpdatedState ] = useState<boolean>(false);

    useEffect((): void => {
        if(value < 0) {
            setMessage("err.invalid");
            setState("error");
        } else {
            setMessage("");
            setState("none");
        }
    }, [ value ]);

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const v: string = (e.target as any).value as string;
        setValue(parseInt(v));
    };
    const save = (): void => {
        setSavingState(true)
        docks.edit(id, { address: value })
            .then((_response): void => {
                setAddress(value);
                onUpdate(value);
                setUpdatedState(true);
                setState("success");
                setMessage(t("ok.updated"))
            }).catch(err => console.error(err))
            .finally((): void => {
                setSavingState(false);
            });
    };
    const cancel = (): void => {
        setValue(content);
        setEditMode(false);
    };

    return (<>
        <div className={styles.root + " jBar"}>
            <div className="l">{t(strings.label)}</div>
            <div className="r flex-edtbl-dt">
                { !editMode && (<span>{ content }</span>) }
                { !editMode && editable && <Button onClick={() => setEditMode(true)} appearance={"subtle"} size={"small"} icon={<Edit16Filled />} />}
            </div>
            { (editMode && editable) && <Field
                validationMessage={message}
                validationState={state}>
                <Input
                    type={"number"}
                    disabled={saving}
                    value={value + ""}
                    onChange={onInputChange}
                />
            </Field> }
    </div>
    { (editMode && editable) && <div className="rtlCell">
        <Button
            appearance={"primary"}
            onClick={save}
            iconPosition={"before"}
            icon={saving ? <Spinner size={"extra-tiny"} /> : null}
            disabled={saving || content === value}>
            { saving ? t('st.saving') : t('st.save') }
        </Button>
        <Button
            onClick={cancel}
            appearance={(updated && content === value) ? "primary" : "secondary"}>
            { (updated && content === value) ? t('st.close') : t('st.cancel') }
        </Button>
    </div> }
    </>);
};
export default AddressField;