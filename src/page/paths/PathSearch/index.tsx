import React, {useEffect, useReducer, useState} from "react";
import {IPathSearchProps} from "./defs";
import {
    Avatar,
    Button,
    Input,
    Persona
} from "@fluentui/react-components";
import {useTranslation} from "react-i18next";
import {Add24Filled, Building20Filled, Search20Filled} from "@fluentui/react-icons";
import {IPath} from "../../../data/models/path";
import * as paths from "../../../data/actions/path";
import LoadMoreButton from "../../../components/basic/buttons/LoadMoreButton";
import {NavigateFunction, useNavigate} from "react-router-dom";
import {IBoat} from "../../../data/models/boat";
import WelcomingTitle from "../../../components/basic/WelcomingTitle";
import {SearchBox} from "@fluentui/react-search-preview";

const LANG_PATH: string = "pages.Paths";
const resultsReducer = (state: IPath[], action: { type: string, payload: IPath | IPath[] }): IPath[] => {
    const exists = (_id: string): boolean => !(state.every((x: IPath): boolean => x._id !== _id));
    switch(action.type) {
        case "ADD": {
            if(exists((action.payload as IPath)._id)) return [ ...state ];
            else return [ ...state, action.payload as IPath ];
        }
        case "RESET": {
            return [];
        }
        default: {
            return [ ...state ];
        }
    }
};
const EnterpriseSearch = ({ me }: IPathSearchProps): React.JSX.Element => {
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
        paths.search(query, {p, itemsPerPage})
            .then((data: IPath[]): void => {
                data.map((each: IPath) => dispatchResults({type: "ADD", payload: each}));
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
        <WelcomingTitle content={t("title")}/>
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
                                             navigate("/paths/add");
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
            {results.map((result: IPath) => {
                const typel: string = (result.boat as IBoat).name?? "";
                return <Button key={"enterpriseSearchPage_item$" + result._id} onClick={(_e) => {
                    navigate("/paths/" + result._id);
                }} className={"fullWidth fstart"} appearance={"subtle"}>
                    <Persona textPosition={"after"} avatar={<Avatar className={"_avtar"} size={48} icon={<Building20Filled />}/>} name={(result).title?? ""} secondaryText={typel} />
                </Button>
            })}
            <LoadMoreButton loading={searching} onClick={more} />
        </div>
    </div>)
};
export default EnterpriseSearch;