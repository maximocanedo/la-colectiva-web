import React, {useEffect, useReducer, useState} from "react";
import {useTranslation} from "react-i18next";
import {IBoatFinderProps} from "./defs";
import {useStyles} from "./styles";
import {SearchBox} from "@fluentui/react-search-preview";
import {Button} from "@fluentui/react-components";
import {Add24Filled, Search20Filled} from "@fluentui/react-icons";
import BoatList from "../BoatList";
import {IBoat} from "../../../data/models/boat";
import LoadMoreButton from "../../basic/buttons/LoadMoreButton";
import * as boats from "../../../data/actions/boat";
import {useNavigate} from "react-router-dom";

const LANG_PATH: string = "pages.boats.SearchPage";
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
const BoatFinder = ({ creatable, onSelect }: IBoatFinderProps): React.JSX.Element => {
    const {t: translate} = useTranslation();
    const t = (key: string): string => translate(LANG_PATH + "." + key);
    const [ query, setQuery ] = useState<string>("");
    const [ results, dispatchResults ] = useReducer(itemsReducer, []);
    const [ page, setPage ] = useState<number>(0);
    const [ size, setSize ] = useState<number>(10);
    const [ searching, setSearchingState ] = useState<boolean>(false);
    const navigate = useNavigate();
    const styles = useStyles();
    const canCreate: boolean = creatable;
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
        <br/>
        <BoatList data={results} onClick={(data: IBoat): void => {
            onSelect(data);
        }}/>
        <LoadMoreButton loading={searching} onClick={() => {
            search();
        }}/>
    </div>);
};
export default BoatFinder;