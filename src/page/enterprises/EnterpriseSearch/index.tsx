import React, {useEffect, useReducer, useState} from "react";
import {IEnterpriseSearchProps} from "./defs";
import {
    Avatar,
    Button,
    Input,
    Persona
} from "@fluentui/react-components";
import {useTranslation} from "react-i18next";
import {Add24Filled, Building20Filled, Search20Filled} from "@fluentui/react-icons";
import {IEnterprise} from "../../../data/models/enterprise";
import * as enterprises from "../../../data/actions/enterprise";
import LoadMoreButton from "../../../components/basic/buttons/LoadMoreButton";
import {NavigateFunction, useNavigate} from "react-router-dom";

const LANG_PATH: string = "pages.Enterprises";
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
const EnterpriseSearch = ({ toasterId, me }: IEnterpriseSearchProps): React.JSX.Element => {
    const { t: translate } = useTranslation();
    const navigate: NavigateFunction = useNavigate();
    const t = (key: string): string => translate(LANG_PATH + "." + key);
    const [ query, setQuery ] = useState<string>("");
    const [ searching, setSearchingState ] = useState<boolean>(false);
    const [ results, dispatchResults ] = useReducer(resultsReducer, []);
    const [ page, setPage ] = useState<number>(0);
    const [ size, setSize ] = useState<number>(10);

    const canCreate: boolean =
        me !== undefined && me !== null
        && (me.active && me.role >= 2);

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
/// <BreadcrumbDivider />
    return (<div className={"page-content flex-down"}>
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
        {
            canCreate && <div className="jBar">
                <div className="r">
                    <Button
                        onClick={(e): void => {
                            navigate("/enterprises/add");
                        }}
                        appearance={"primary"}
                        icon={<Add24Filled/>}>Registrar una empresa</Button></div>
            </div>
        }
        <div className={"searchresults"}>
            {results.map((result: IEnterprise) => {
                const typel: string = enterprises.formatCUIT(result.cuit as number);
                return <Button key={"enterpriseSearchPage_item$" + result._id} onClick={(_e) => {
                    navigate("/enterprises/" + result._id);
                }} className={"fullWidth fstart"} appearance={"subtle"}>
                    <Persona textPosition={"after"} avatar={<Avatar className={"_avtar"} size={48} icon={<Building20Filled />}/>} name={result.name} secondaryText={typel} />
                </Button>
            })}
            <LoadMoreButton loading={searching} onClick={more} />
        </div>
    </div>)
};
export default EnterpriseSearch;