import React from "react";
import {RegionTypeSelectorProps} from "./defs";
import {Combobox, Option} from "@fluentui/react-components";
import {RegionType} from "../../../data/models/region";
import {useTranslation} from "react-i18next";
import {log} from "../../page/definitions";

const RegionTypeSelector = ({ value, requiredEmptyLabelOption, required, onChange, ...props }: RegionTypeSelectorProps): React.JSX.Element => {
    const { t: translate } = useTranslation();
    log("RegionTypeSelector");

    const strToRT = (x: string): RegionType => {
        const e: number = parseInt(x);
        if(e <= 14 && e >= 0) return e as RegionType;
        return 0;
    }
    const regionTypesNames: string[] = [
        "models.region.types.river", "models.region.types.stream", "models.region.types.brook", "models.region.types.canal", "models.region.types.lake", "models.region.types.pond", "models.region.types.lagoon", "models.region.types.reservoir", "models.region.types.swamp", "models.region.types.well", "models.region.types.aquifer", "models.region.types.bay", "models.region.types.gulf", "models.region.types.sea", "models.region.types.ocean"
    ];
    const regionTranslatedNames: string[] = regionTypesNames.map((x: string) => translate(x));

    return (<>
        <Combobox
            { ...props }
            defaultSelectedOptions={[(value === null ? "__null" : value) + ""]}
            value={value === null ? requiredEmptyLabelOption : regionTranslatedNames[value]}
            defaultValue={value === null ? requiredEmptyLabelOption : regionTranslatedNames[value]}
            placeholder=""
            onOptionSelect={(ev, data) => {
                if(data.optionValue !== undefined) {
                    if(data.optionValue === "__null") return onChange(null);
                    onChange(strToRT(data.optionValue as string));
                }
            }}>
        { !required && <Option value={"__null"} key={"regionType$NoValue"}>{requiredEmptyLabelOption}</Option>}
        {regionTranslatedNames.map((option: string, index: number) => (
            <Option value={index + ""} key={"regionType$TranslatedName_" + option}>
                {option}
            </Option>
        ))}
    </Combobox></>);
};
export default RegionTypeSelector;