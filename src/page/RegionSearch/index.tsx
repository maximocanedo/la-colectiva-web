import React, {useEffect, useReducer, useState} from "react";
import {RegionSearchPageProps} from "./defs";
import {Avatar, Button, Card, CardPreview, Input, Persona, Subtitle2} from "@fluentui/react-components";
import {useTranslation} from "react-i18next";
import {Add24Filled, OpenRegular, Search20Filled, Water20Filled} from "@fluentui/react-icons";
import {IRegion} from "../../data/models/region";
import * as regions from "../../data/actions/region";
import LoadMoreButton from "../../components/basic/buttons/LoadMoreButton";
import {getRegionTypeLangPathNameFor} from "../RegionPage/defs";
import {NavigateFunction, useNavigate} from "react-router-dom";
import WelcomingTitle from "../../components/basic/WelcomingTitle";
import {SearchBox} from "@fluentui/react-search-preview";

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
const RegionSearch = ({ me }: RegionSearchPageProps): React.JSX.Element => {
    const { t: translate } = useTranslation();

    const navigate: NavigateFunction = useNavigate();
    const t = (key: string): string => translate(LANG_PATH + "." + key);
    const [ query, setQuery ] = useState<string>("");
    const [ searching, setSearchingState ] = useState<boolean>(false);
    const [ results, dispatchResults ] = useReducer(resultsReducer, []);
    const [ page, setPage ] = useState<number>(0);
    const [ size, ] = useState<number>(10);

    const canCreate: boolean =
        me !== undefined && me !== null
        && (me.active && me.role >= 2);

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
        // eslint-disable-next-line
    }, [ ]);

    const more = (): void => {
        setPage(page + 1);
        search();
    };
/// <BreadcrumbDivider />
    return (<div className={"page-content flex-down v2"}>
        <WelcomingTitle content={"Regiones"} />
        <div className="searchBarContainer">
            <SearchBox
                className={"preSearchBar"}
                placeholder={t("label.search")}
                aria-label={t("label.search")}
                value={query}
                onChange={(e,d): void => { setQuery(d.value) }}
                />
                <div className="barCol">
                    <Button className={"min300"}
                            onClick={(_e): void => {
                                navigate("/regions/add");
                            }}
                            appearance={"secondary"}
                            icon={<Add24Filled/>}>
                        {translate("actions.register")}
                    </Button>
                    <Button className={"min300"} appearance={"primary"} onClick={(_e): void => {
                        dispatchResults({ type: "RESET", payload: []});
                        search();
                    }}><Search20Filled /></Button>
                </div>
        </div>
        {
            canCreate && <div className="jBar">
                <div className="r">
                    </div>
            </div>
        }
        <div className={"searchresults"}>
            {results.map((result: IRegion) => {
                const typel: string = result.type === undefined ? "" : translate(getRegionTypeLangPathNameFor((result.type) as number));
                const fullName: string = translate("models.region.longName").replace("%type", typel).replace("%name", result.name);

                return <Card onClick={(): void => {
                    navigate("/regions/" + result._id)
                }} appearance={"subtle"} className={"regionCard"}>
                    <Subtitle2>{fullName}</Subtitle2>
                    <Button appearance={"subtle"} icon={<OpenRegular />}></Button>
                </Card>
            })}
            <LoadMoreButton loading={searching} onClick={more} />
        </div>
    </div>)
};
export default RegionSearch;