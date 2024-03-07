import React, {useEffect, useReducer, useState} from "react";
import {RegionSearchPageProps} from "./defs";
import {
    Avatar,
    Breadcrumb,
    BreadcrumbButton, BreadcrumbDivider,
    BreadcrumbItem,
    Button,
    Combobox,
    Input,
    Option,
    Persona
} from "@fluentui/react-components";
import {useTranslation} from "react-i18next";
import {Search20Filled, Water20Filled} from "@fluentui/react-icons";
import {IRegion, RegionType} from "../../data/models/region";
import RegionTypeSelector from "../../components/region/RegionTypeSelector";
import {NullableRegionType} from "../../components/region/RegionTypeSelector/defs";
import * as regions from "../../data/actions/region";
import LoadMoreButton from "../../components/basic/buttons/LoadMoreButton";
import {getRegionTypeLangPathNameFor} from "../RegionPage/defs";

const LANG_PATH: string = "pages.Regions";
const resultsReducer = (state: IRegion[], action: { type: string, payload: IRegion | IRegion[] }): IRegion[] => {
    const exists = (_id: string): boolean => !(state.every((x: IRegion): boolean => x._id !== _id));
    switch(action.type) {
        case "ADD": {
            if(exists((action.payload as IRegion)._id)) return [ ...state ];
            else return [ ...state, action.payload as IRegion ];
        }
        case "RESET": {
            return [];
        }
        default: {
            return [ ...state ];
        }
    }
}
const RegionSearch = ({ toasterId }: RegionSearchPageProps): React.JSX.Element => {
    const { t: translate } = useTranslation();
    const t = (key: string): string => translate(LANG_PATH + "." + key);
    const [ query, setQuery ] = useState<string>("");
    const [ searching, setSearchingState ] = useState<boolean>(false);
    const [ results, dispatchResults ] = useReducer(resultsReducer, []);
    const [ page, setPage ] = useState<number>(0);
    const [ size, setSize ] = useState<number>(10);

    const search = (p: number = page, itemsPerPage: number = size): void => {
        setSearchingState(true);
        regions.search(query, {p, itemsPerPage})
            .then((data: IRegion[]): void => {
                data.map((each: IRegion) => dispatchResults({type: "ADD", payload: each}));
                if(data.length < size && page !== 0) setPage(page - 1);
            }).catch(err => console.error(err)).finally((): void => {
                setSearchingState(false);
            });
    };
    useEffect(() => {
        search(0, 10);
    }, [ ]);

    const more = (): void => {
        setPage(page + 1);
        search();
    };
/// <BreadcrumbDivider />
    return (<div className={"page-content flex-down"}>
        <Breadcrumb
            aria-label="Small breadcrumb example with buttons"
            size="small"
        >
            <BreadcrumbItem>
                <BreadcrumbButton>Regiones</BreadcrumbButton>
            </BreadcrumbItem>

        </Breadcrumb>
        <div className="searchbar">
            <div className="_row">
                <Input
                    className={"_searchInput"}
                    size="large"
                    value={query}
                    onChange={(ev): void => setQuery(ev.target.value)}
                    placeholder={t("label.search")}
                    aria-label={t("label.search")} />
                <Button size={"large"} appearance={"primary"} onClick={(e): void => {

                    dispatchResults({ type: "RESET", payload: []});
                    search();
                }}><Search20Filled /></Button>
            </div>
        </div>
        <div className={"searchresults"}>
            { results.map((result: IRegion) => {
                const typel: string = result.type === undefined ? "" : translate(getRegionTypeLangPathNameFor((result.type) as number));
                return <Button onClick={(_e) => {
                    window.location.href = "/regions/" + result._id;
                }} className={"fullWidth fstart"} appearance={"subtle"}>
                    <Persona textPosition={"after"} avatar={<Avatar className={"_avtar"} size={48} icon={<Water20Filled/>}/>} name={result.name} secondaryText={typel} />
                </Button>
            })}
            <LoadMoreButton loading={searching} onClick={more} />
        </div>
    </div>)
};
export default RegionSearch;