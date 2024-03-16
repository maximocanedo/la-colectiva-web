import React, {useEffect, useReducer, useState} from "react";
import {useTranslation} from "react-i18next";
import {IBoatListForEnterpriseProps} from "./defs";
import {useStyles} from "./styles";
import {IBoat} from "../../../data/models/boat";
import * as boats from "../../../data/actions/boat";
import * as enterprises from "../../../data/actions/enterprise";
import BoatList from "../BoatList";
import { useNavigate } from "react-router-dom";
import LoadMoreButton from "../../basic/buttons/LoadMoreButton";

const LANG_PATH: string = "components.BoatListForEnterprise";
const strings = {};
const ADD: string = "ADD";
const CLEAR: string = "CLEAR";
const boatsReducer = (state: IBoat[], {type, payload}: {type: string, payload: IBoat | null}): IBoat[] => {
    const exists = (x: IBoat) => state.some(y => x._id === y._id);
    if(payload !== null && type === ADD && !exists(payload)) return [ ...state, payload ];
    if(type === CLEAR) return [];
    return [ ...state ];
}
const BoatListForEnterprise = ({ enterprise, onClick }: IBoatListForEnterpriseProps): React.JSX.Element => {
    const {t: translate} = useTranslation();
    const t = (key: string): string => translate(LANG_PATH + "." + key);
    const styles = useStyles();
    const navigate = useNavigate();
    const [ page, setPage ] = useState<number>(0);
    const [ size, setSize ] = useState<number>(10);
    const [ loading, setLoadingState ] = useState<boolean>(false);
    const [ results, dispatchResults ] = useReducer(boatsReducer, []);
    const fetchData = () => {
        setLoadingState(true);
        boats.search("", { p: page, itemsPerPage: size }, enterprise)
            .then((data: IBoat[]): void => {
                data.map(payload => dispatchResults({ type: ADD, payload }));
                if(data.length === size)
                    setPage(page + 1);
            })
            .catch(err => console.error(err))
            .finally((): void => {
                setLoadingState(false);
            })
    };
    useEffect(() => {
        fetchData();
    }, []);

    return (<div>
        <BoatList data={results} onClick={onClick} />
        <LoadMoreButton loading={loading} onClick={(): void => {
            fetchData();
        }} />
    </div>);
};
export default BoatListForEnterprise;