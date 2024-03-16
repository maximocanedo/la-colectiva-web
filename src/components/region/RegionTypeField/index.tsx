import React, {useEffect, useState} from "react";
import {RegionRoleProps} from "./defs";
import {useTranslation, UseTranslationResponse} from "react-i18next";
import {StateManager} from "../../../page/SignUpPage/defs";
import {FieldValidationStatus} from "../../user/user-page/RoleSelector/defs";
import {Button, Combobox, Option, Field, Spinner} from "@fluentui/react-components";
import {Edit16Filled} from "@fluentui/react-icons";
import {RegionType} from "../../../data/models/region";
import * as regions from "../../../data/actions/region";
import {CommonResponse} from "../../../data/utils";
import {log} from "../../page/definitions";

const RegionTypeField = ({ initialValue, editable, onUpdate, id }: RegionRoleProps): React.JSX.Element => {
    log("RegionTypeField");
    const langPath: string = "components.region.RegionType";
    // Translation functions
    const { t: _translate }: UseTranslationResponse<"translation", undefined> = useTranslation();
    const t = (path: string): string => _translate(langPath + "." + path);
    const [ hv, setHV ]: StateManager<string> = useState<string>("");
    // Values
    const [ value, setValue ]: StateManager<RegionType> = useState<RegionType>(initialValue);

    // States
    const [ saving, setSaving ]: StateManager<boolean> = useState<boolean>(false);
    const [ updated, setUpdate ]: StateManager<boolean> = useState<boolean>(false);
    const [ editMode, setEditMode ]: StateManager<boolean> = useState<boolean>(false);

    // Validation
    const [ fieldMessage, setFieldMessage ]: StateManager<string> = useState<string>("");
    const [ fieldState, setFieldState ]: StateManager<FieldValidationStatus> = useState<FieldValidationStatus>();
    const validate = (message: string, state: FieldValidationStatus): void => {
        setFieldMessage(message);
        setFieldState(state);
    };

    const startEditMode = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
        if(editable) setEditMode(true);
    };
    const cancel = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
        setEditMode(false);
        setUpdate(false);
        validate("", "none");
    };

    const regionTypesNames: string[] = [
        "models.region.types.river", "models.region.types.stream", "models.region.types.brook", "models.region.types.canal", "models.region.types.lake", "models.region.types.pond", "models.region.types.lagoon", "models.region.types.reservoir", "models.region.types.swamp", "models.region.types.well", "models.region.types.aquifer", "models.region.types.bay", "models.region.types.gulf", "models.region.types.sea", "models.region.types.ocean", "models.region.types.unknown"
    ];
    const regionTranslatedNames: string[] = regionTypesNames.map((x: string) => _translate(x));
    useEffect((): void => {
        setHV(regionTranslatedNames[initialValue]);
    }, [ initialValue, regionTranslatedNames ]);
    const save = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
        setSaving(true);
        regions.edit(id, { type: value })
            .then((response: CommonResponse): void => {
                if(response.success) {
                    setHV(regionTranslatedNames[value]);
                    setUpdate(true);
                    onUpdate(value);
                } else {

                }
            }).catch((err) => {

            }).finally((): void => {
                setSaving(false);
            });
    };
    const strToRT = (x: string): RegionType => {
        const e: number = parseInt(x);
        if(e <= 14 && e >= 0) return e as RegionType;
        return 0;
    }

    return (<>
        <div className="jBar">
            <span className="l">{t('label')}</span>
            <div className="r flex-edtbl-dt">
                {(!editMode) && <span>{hv}</span> }
                {(!editMode && editable) &&  <Button onClick={startEditMode} appearance={"subtle"} size={"small"} icon={<Edit16Filled />} />}
            </div>
            { (editMode && editable) && <Field validationMessage={fieldMessage} validationState={fieldState}>
                <Combobox defaultSelectedOptions={[value + ""]} value={regionTranslatedNames[value]} defaultValue={regionTranslatedNames[value]} placeholder="" disabled={saving}
                onOptionSelect={(ev, data) => {
                    if(data.optionValue !== undefined) setValue(strToRT(data.optionValue as string));
                }}>
                    {regionTranslatedNames.map((option: string, index: number) => (
                        <Option value={index + ""} key={"regionType$TranslatedName_" + option}>
                            {option}
                        </Option>
                    ))}
                </Combobox>
            </Field> }
        </div>
        { (editMode && editable) && <div className="rtlCell">
            <Button
                appearance={"primary"}
                onClick={save}
                disabled={initialValue === value}
            >{ saving && <Spinner size={"extra-tiny"} /> }
                { saving ? t('st.saving') : t('st.save') }
            </Button>
            <Button
                onClick={cancel}
                appearance={(updated && initialValue === value) ? "primary" : "secondary"}>
                { (updated && initialValue === value) ? t('st.close') : t('st.cancel') }
            </Button>
        </div>}
    </>);
};
export default RegionTypeField;