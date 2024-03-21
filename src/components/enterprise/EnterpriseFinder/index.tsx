import React, {useEffect, useReducer, useState} from "react";
import {useTranslation} from "react-i18next";
import {IEnterpriseFinderProps} from "./defs";
import {useStyles} from "./styles";
import {SearchBox} from "@fluentui/react-search-preview";
import {Avatar, Button, Persona} from "@fluentui/react-components";
import {Add24Filled, Building20Filled, Search20Filled} from "@fluentui/react-icons";
import {IEnterprise} from "../../../data/models/enterprise";
import * as enterprises from "../../../data/actions/enterprise";
import LoadMoreButton from "../../basic/buttons/LoadMoreButton";
import {NavigateFunction, useNavigate} from "react-router-dom";

const LANG_PATH: string = "pages.Enterprises";
const strings = {};
const resultsReducer = (state: IEnterprise[], action: { type: string, payload: IEnterprise | IEnterprise[] }): IEnterprise[] => {
    const exists = (_id: string): boolean => !(state.every((x: IEnterprise): boolean => x._id !== _id));
    switch(action.type) {
        case "ADD": {
            if(exists((action.payload as IEnterprise)._id)) return [ ...state ];
            else return [ ...state, action.payload as IEnterprise ];
        }
        case "RESET": {
            return [];
        }
        default: {
            return [ ...state ];
        }
    }
}
const EnterpriseFinder = ({ creatable, onSelect }: IEnterpriseFinderProps): React.JSX.Element => {
    const {t: translate} = useTranslation();
    const t = (key: string): string => translate(LANG_PATH + "." + key);
    const navigate: NavigateFunction = useNavigate();
    const styles = useStyles();
    const [ query, setQuery ] = useState<string>("");
    const [ searching, setSearchingState ] = useState<boolean>(false);
    const [ results, dispatchResults ] = useReducer(resultsReducer, []);
    const [ page, setPage ] = useState<number>(0);
    const [ size, ] = useState<number>(10);

    const canCreate: boolean = creatable;

    const search = (p: number = page, itemsPerPage: number = size): void => {
        setSearchingState(true);
        enterprises.search(query, {p, itemsPerPage})
            .then((data: IEnterprise[]): void => {
                data.map((each: IEnterprise) => dispatchResults({type: "ADD", payload: each}));
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
                                             navigate("/enterprises/add");
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
            {results.map((result: IEnterprise) => {
                const typel: string = enterprises.formatCUIT(result.cuit as number);
                return <Button key={"enterpriseSearchPage_item$" + result._id} onClick={(_e) => {
                    onSelect(result);
                }} className={"fullWidth fstart"} appearance={"subtle"}>
                    <Persona textPosition={"after"}
                             avatar={<Avatar className={"_avtar"} size={48} icon={<Building20Filled/>}/>}
                             name={result.name} secondaryText={typel}/>
                </Button>
            })}
            <LoadMoreButton loading={searching} onClick={more}/>
        </div>

    </div>);
};
export default EnterpriseFinder;