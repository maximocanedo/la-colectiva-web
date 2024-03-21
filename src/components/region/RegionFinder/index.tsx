import React, {useEffect, useReducer, useState} from "react";
import {useTranslation} from "react-i18next";
import {IRegionFinderProps} from "./defs";
import {useStyles} from "./styles";
import {SearchBox} from "@fluentui/react-search-preview";
import {Button, Card, Subtitle2} from "@fluentui/react-components";
import {Add24Filled, OpenRegular, Search20Filled} from "@fluentui/react-icons";
import {IRegion} from "../../../data/models/region";
import {getRegionTypeLangPathNameFor} from "../../../page/RegionPage/defs";
import LoadMoreButton from "../../basic/buttons/LoadMoreButton";
import * as regions from "../../../data/actions/region";
import {useNavigate} from "react-router-dom";

const LANG_PATH: string = "pages.Regions";
const strings = {};
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
const RegionFinder = ({ creatable, onSelect, icon }: IRegionFinderProps): React.JSX.Element => {
    const {t: translate} = useTranslation();
    const t = (key: string): string => translate(LANG_PATH + "." + key);
    const [ query, setQuery ] = useState<string>("");
    const [ searching, setSearchingState ] = useState<boolean>(false);
    const [ results, dispatchResults ] = useReducer(resultsReducer, []);
    const [ page, setPage ] = useState<number>(0);
    const [ size, ] = useState<number>(10);
    const navigate = useNavigate();
    const canCreate: boolean = creatable;
    const styles = useStyles();
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
    return (<div className={styles.root}>
        <div className="searchBarContainer">
            <SearchBox
                className={"preSearchBar"}
                placeholder={t("label.search")}
                aria-label={t("label.search")}
                value={query}
                onChange={(e, d): void => {
                    setQuery(d.value)
                }}
            />
            <div className="barCol">
                {
                    canCreate && <Button className={"min300"}
                                         onClick={(_e): void => {
                                             navigate("/regions/add");
                                         }}
                                         appearance={"secondary"}
                                         icon={<Add24Filled/>}>
                        {translate("actions.register")}
                    </Button>
                }
                <Button
                    className={"min300"}
                    appearance={"primary"}
                    icon={<Search20Filled/>}
                    onClick={(_e): void => {
                        dispatchResults({type: "RESET", payload: []});
                        search();
                    }}>{translate("actions.search")}</Button>
            </div>
        </div>
        <div className={"searchresults"}>
            {results.map((result: IRegion) => {
                const typel: string = result.type === undefined ? "" : translate(getRegionTypeLangPathNameFor((result.type) as number));
                const fullName: string = translate("models.region.longName").replace("%type", typel).replace("%name", result.name);

                return <Card onClick={(): void => onSelect(result)} appearance={"subtle"} className={"regionCard"}>
                    <Subtitle2>{fullName}</Subtitle2>
                    { icon !== null && <Button appearance={"subtle"} icon={icon !== undefined ? icon : <OpenRegular />}></Button>}
                </Card>
            })}
            <LoadMoreButton loading={searching} onClick={more}/>
        </div>
    </div>);
};
export default RegionFinder;