import React, {useEffect, useReducer, useState} from "react";
import {useTranslation} from "react-i18next";
import {IRegionSelectorProps} from "./defs";
import {Combobox, Option, OptionOnSelectData, Persona, SelectionEvents, useId} from "@fluentui/react-components";
import {IRegion} from "../../../data/models/region";
import LoadMoreButton from "../../basic/buttons/LoadMoreButton";
import {IPaginator} from "../../../data/models/comment";
import * as regions from "../../../data/actions/region";
import {log} from "../../page/definitions";

const LANG_PATH: string = "components.region.RegionSelector";
const strings = {
    placeholder: "placeholder"
};
const ADD: string = "ADD";
const CLEAR: string = "CLEAR";
 const itemsReducer = (state: IRegion[], action: { type: string, payload: IRegion }): IRegion[] => {
     const exists = (id: string): boolean => state.some(x => x._id === id);
     if(action.type === ADD) {
         const { payload } = action;
         if(exists(payload._id)) return [ ...state ];
         return [ ...state, payload ];
     }
     if(action.type === CLEAR) return [];
     return [ ...state ];
 }

const RegionSelector = ({ selected, onSelect }: IRegionSelectorProps): React.JSX.Element => {
    log("RegionSelector");
    const comboId = useId();
    const { t: translate } = useTranslation();
    const t = (key: string): string => translate(`${LANG_PATH}.${key}`);
    const [ items, dispatchItems ] = useReducer(itemsReducer, [
        ...( selected === null ? [] : [ selected ])
    ]);
    const [ page, setPage ] = useState<number>(0);
    const [ size, setSize ] = useState<number>(3);
    const [ searching, setSearchingState ] = useState<boolean>(false);
    const [query, setQuery] = React.useState<string>("");

    const search = (q: string, { p, itemsPerPage }: IPaginator): void => {
        setSearchingState(true);
        regions.search(q, { p, itemsPerPage })
            .then((response: IRegion[]): void => {
                response.map(x => dispatchItems({ type: ADD, payload: x }));
            }).catch(err => console.error(err)).finally((): void => {
                setSearchingState(false);
        });
    };
    useEffect(() => {
        search(query, { p: page, itemsPerPage: size });
    }, [ page ]);

    const onSelectChange = (event: SelectionEvents, data: OptionOnSelectData): void => {
        const id: string = data.optionValue?? "";
        const name: string = data.optionText?? "";
        onSelect({ _id: id, name });
    }


    const regionTypesNames: string[] = [
        "models.region.types.river", "models.region.types.stream", "models.region.types.brook", "models.region.types.canal", "models.region.types.lake", "models.region.types.pond", "models.region.types.lagoon", "models.region.types.reservoir", "models.region.types.swamp", "models.region.types.well", "models.region.types.aquifer", "models.region.types.bay", "models.region.types.gulf", "models.region.types.sea", "models.region.types.ocean"
    ];
    const regionTranslatedNames: string[] = regionTypesNames.map((x: string) => translate(x));


    return (<Combobox
        aria-labelledby={comboId}
        placeholder={t(strings.placeholder)}
        onOptionSelect={onSelectChange}
        selectedOptions={[...(selected === null ? [] : [ selected._id ])]}
        value={selected === null ? "" : selected.name?? ""}
    >
        {items.map((data: IRegion) => {
            return <Option
                key={data._id + "$Option"}
                text={data.name?? ""}
                value={data._id}
            >
                <Persona
                    key={data._id + "$Persona"}
                    avatar={{ color: "colorful" }}
                    name={data.name?? ""}
                    secondaryText={regionTranslatedNames[data.type?? 0]}
                />
            </Option>
        })}
        <div className={"load_moreBtn"}>
            <LoadMoreButton loading={searching} onClick={(): void => {
                setPage(page + 1);
            }} />
        </div>
    </Combobox>);
};
export default RegionSelector;