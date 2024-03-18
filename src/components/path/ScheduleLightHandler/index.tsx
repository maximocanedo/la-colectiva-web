import React, {useEffect, useReducer, useState} from "react";
import {useTranslation} from "react-i18next";
import {IScheduleLightHandlerProps} from "./defs";
import {useStyles} from "./styles";
import {IScheduleView} from "../../../data/models/schedules";
import * as paths from "../../../data/actions/path";
import ScheduleItem from "../../schedules/l/ScheduleItem";
import {mergeClasses} from "@fluentui/react-components";
import LoadMoreButton from "../../basic/buttons/LoadMoreButton";

const LANG_PATH: string = "components.ScheduleLightHandler";
const strings = {};
const ADD: string = "ADD";
const REMOVE: string = "REMOVE";
const CLEAR: string = "CLEAR";
const reducer = (state: IScheduleView[], { type, payload }: { type: string, payload: IScheduleView }): IScheduleView[] => {
    const exists = (x: IScheduleView): boolean => state.some(y => x._id === y._id);
    if(type === ADD && !exists(payload)) return [ ...state, payload ];
    if(type === REMOVE && exists(payload)) return state.filter(x => x._id !== payload._id);
    if(type === CLEAR) return [];
    return [ ...state ];
};
const ScheduleLightHandler = ({ id }: IScheduleLightHandlerProps): React.JSX.Element => {
    const {t: translate} = useTranslation();
    const t = (key: string): string => translate(LANG_PATH + "." + key);
    const styles = useStyles();
    const [ loading, setLoadingState ] = useState<boolean>(false);
    const [ data, dispatchData ] = useReducer(reducer, []);
    const [ page, setPage ] = useState<number>(0);
    const [ size, setSize ] = useState<number>(5);

    const search = () => {
        setLoadingState(true);
        paths.getSchedules(id, "", { p: page, itemsPerPage: size })
            .then((response: IScheduleView[]): void => {
                response.map(payload => dispatchData({ type: ADD, payload }));
                if(response.length === size) setPage(page + 1);
            })
            .catch(err => {
                console.error(err);
            })
            .finally((): void => {
                setLoadingState(false);
            });
    };

    useEffect((): void => {
        search();
    }, []);

    return (<div className={mergeClasses(styles.root, "sch_handler")}>
            { data.map(schedule => <ScheduleItem {...schedule} key={schedule._id} />) }
        <LoadMoreButton loading={loading} onClick={() => search()} />
    </div>);
};
export default ScheduleLightHandler;