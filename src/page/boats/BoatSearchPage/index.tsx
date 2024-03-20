import React, {useEffect, useReducer, useState} from "react";
import {useTranslation} from "react-i18next";
import {IBoatSearchPageProps} from "./defs";
import {useStyles} from "./styles";
import {Avatar, Button, Input, Persona} from "@fluentui/react-components";
import {Add24Filled, Building20Filled, Search20Filled} from "@fluentui/react-icons";
import {IBoat} from "../../../data/models/boat";
import * as boats from "../../../data/actions/boat";
import {IEnterprise} from "../../../data/models/enterprise";
import * as enterprises from "../../../data/actions/enterprise";
import LoadMoreButton from "../../../components/basic/buttons/LoadMoreButton";
import {useNavigate} from "react-router-dom";
import BoatList from "../../../components/boat/BoatList";
import WelcomingTitle from "../../../components/basic/WelcomingTitle";
import {SearchBox} from "@fluentui/react-search-preview";

const LANG_PATH: string = "pages.boats.SearchPage";
const strings = {};
const ADD: string = "ADD";
const CLEAR: string = "CLEAR";
const itemsReducer = (state: IBoat[], { type, payload }: { type: string, payload: IBoat | null }): IBoat[] => {
    const exists = (el: IBoat): boolean => state.some(x => x._id === el._id);
    switch(type) {
        case ADD: {
            if(payload === null) return [ ...state ];
            if(exists(payload)) return [ ...state ];
            else return [ ...state, payload ];
        }
        case CLEAR:
            return [ ];
        default:
            return [ ...state ];
    }
};
const BoatSearchPage = ({ me }: IBoatSearchPageProps): React.JSX.Element => {
    const {t: translate} = useTranslation();
    const t = (key: string): string => translate(LANG_PATH + "." + key);
    const [ query, setQuery ] = useState<string>("");
    const [ results, dispatchResults ] = useReducer(itemsReducer, []);
    const [ page, setPage ] = useState<number>(0);
    const [ size, setSize ] = useState<number>(10);
    const [ searching, setSearchingState ] = useState<boolean>(false);
    const styles = useStyles();
    const navigate = useNavigate();

    const search = (): void => {
        setSearchingState(true);
        boats.search(query, {p: page, itemsPerPage: size})
            .then((response: IBoat[]): void => {
                if(response.length === size) {
                    setPage(page + 1);
                }
                response.map(payload => dispatchResults({ type: ADD, payload }));
            })
            .catch(err => console.error(err))
            .finally((): void => {
                setSearchingState(false);
            });
    };
    useEffect(() => {
        search();
    }, []);
    const more = (): void => {
        search();
    };
    const canCreate: boolean = (me !== null && me !== undefined && me.active && me.role >= 2);

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
                    canCreate && <Button
                        className={"min300"}
                        onClick={(_e): void => {
                            navigate("/boats/add");
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
                        dispatchResults({type: "RESET", payload: null});
                        search();
                    }}>{translate("actions.search")}</Button>
            </div>
        </div>
        <BoatList data={results} onClick={({_id}: IBoat): void => {
            navigate("/boats/" + _id);
        }}/>
        <LoadMoreButton loading={searching} onClick={() => {
            search();
        }}/>
    </div>);
};
export default BoatSearchPage;