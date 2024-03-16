import React, {useEffect, useReducer, useState} from "react";
import {useTranslation} from "react-i18next";
import {IBoatSelectorProps} from "./defs";
import {Combobox, Option, OptionOnSelectData, Persona, SelectionEvents, useId} from "@fluentui/react-components";
import {IBoat} from "../../../data/models/boat";
import LoadMoreButton from "../../basic/buttons/LoadMoreButton";
import {IPaginator} from "../../../data/models/comment";
import * as boats from "../../../data/actions/boat";
import {log} from "../../page/definitions";

const LANG_PATH: string = "components.boat.BoatSelector";
const strings = {
    placeholder: "placeholder"
};
const ADD: string = "ADD";
const CLEAR: string = "CLEAR";
 const itemsReducer = (state: IBoat[], action: { type: string, payload: IBoat }): IBoat[] => {
     const exists = (id: string): boolean => state.some(x => x._id === id);
     if(action.type === ADD) {
         const { payload } = action;
         if(exists(payload._id)) return [ ...state ];
         return [ ...state, payload ];
     }
     if(action.type === CLEAR) return [];
     return [ ...state ];
 }

const RegionSelector = ({ selected, onSelect }: IBoatSelectorProps): React.JSX.Element => {
    log("BoatSelector");
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
        boats.search(q, { p, itemsPerPage })
            .then((response: IBoat[]): void => {
                response.map(payload => dispatchItems({ type: ADD, payload }));
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



    return (<Combobox
        aria-labelledby={comboId}
        placeholder={t(strings.placeholder)}
        onOptionSelect={onSelectChange}
        selectedOptions={[...(selected === null ? [] : [ selected._id ])]}
        value={selected === null ? "" : selected.name?? ""}
    >
        {items.map((data: IBoat) => {
            return <Option
                key={data._id + "$Option"}
                text={data.name?? ""}
                value={data._id}
            >
                <Persona
                    key={data._id + "$Persona"}
                    avatar={{ color: "colorful" }}
                    name={data.name?? ""}
                    secondaryText={data.mat}
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