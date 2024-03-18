import React, {useEffect, useReducer, useState} from "react";
import {useTranslation} from "react-i18next";
import {INextParams, INextProps} from "./defs";
import {useStyles} from "./styles";
import {useParams} from "react-router-dom";
import {Button, mergeClasses} from "@fluentui/react-components";
import TripSelector from "../../components/docks/TripSelector";
import {DockPropertyStatus} from "../../data/models/dock";
import * as docks from "../../data/actions/dock";
import * as schedules from "../../data/actions/schedule";
import {ScheduleGroup} from "../../data/models/schedules";
import SchedulePair from "../../components/schedules/SchedulePair";
import {OptionsRegular} from "@fluentui/react-icons";

const LANG_PATH: string = "components.Next";
const strings = {};
const ADD: string = "ADD";
const CLEAR: string = "CLEAR";
const reducer = (state: ScheduleGroup[], { type, payload }: { type: string, payload: ScheduleGroup | null }): ScheduleGroup[] => {
    const exists = (x: ScheduleGroup): boolean => state.some(y => y._id === x._id);
    if(type === CLEAR) return [];
    if(payload !== null && type === ADD && !exists(payload)) return [ ...state, payload ];
    return [ ...state ];
}
const Next = ({ me }: INextProps): React.JSX.Element => {
    const {t: translate} = useTranslation();
    const t = (key: string): string => translate(LANG_PATH + "." + key);
    const styles = useStyles();
    const _from: string | undefined = useParams<INextParams>().from;
    const _to: string | undefined = useParams<INextParams>().to;
    const [ data, dispatchSchedules ] = useReducer(reducer, []);
    const [ from, setFrom ] = useState<{ _id: string, name: string, status: DockPropertyStatus } | null>(null);
    const [ dest, setDestination ] = useState<{ _id: string, name: string, status: DockPropertyStatus } | null>(null);
    const [ page, setPage ] = useState<number>(0);
    const size: number = 5;
    useEffect((): void => {
        if(_from === undefined) return;
        docks.find(_from)
            .then(e => setFrom(e))
            .catch(err => {
                setFrom({ _id: _from, name: _from, status: DockPropertyStatus.UNLISTED })
                console.error(err);
            });
    }, []);
    useEffect((): void => {
        if(_to === undefined) return;
        docks.find(_to)
            .then(e => setDestination(e))
            .catch(err => {
                setDestination({ _id: _to, name: _to, status: DockPropertyStatus.UNLISTED })
                console.error(err);
            });
    }, []);

    const search = (): void => {
        if(_from === undefined || from === null || _from.length < 24
            || _to === undefined || dest === null || _to.length < 24) return;
        const f: string = _from?? from._id;
        const t: string = _to?? dest._id;
        schedules.next(f, t, "09:30", ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"])
            .then((arr: ScheduleGroup[]): void => {
                console.log(arr);
                arr.map(x => dispatchSchedules({ type: ADD, payload: x }));
                if(arr.length === size) setPage(page + 1);
            }).catch(err => console.error(err))
            .finally((): void => {

            });
    };

    useEffect((): void => {
        if(_from !== undefined && _to !== undefined) search();
    }, []);

    return (<div className={"page-content flex-down"}>
        <div  className={mergeClasses(styles.mapHeaderContainer, "map-header-container")}>
            <div className="map-header-subcontainer">
                <TripSelector from={from} dest={dest} onFromChange={setFrom} onDestinationChange={setDestination}/>
                <div className="btns">
                    <Button
                        appearance={"subtle"}
                        icon={<OptionsRegular />}
                        iconPosition={"before"}
                    >{translate("actions.options")}</Button>
                    <Button
                        onClick={(): void => search()}
                        disabled={_from === undefined || from === null || _from.length < 24
                            || _to === undefined || dest === null || _to.length < 24}
                        appearance={"primary"}>{translate("actions.continue")}</Button>
                </div>
            </div>

        </div>
        <br/><br/><br/><br/><br/><br/><br/>
        {
            data.map(item => {
                const doN = from === null ? {_id: _from as string, name: _from as string} : {
                    _id: from._id as string,
                    name: from.name as string
                };
                const ddN = dest === null ? {_id: _to as string, name: _to as string} : {_id: dest._id as string, name: dest.name as string };
                return <SchedulePair me={me} dockOrigin={doN} dockDestination={ddN} {...item} key={item._id}/>
            })
        }
    </div>);
};
export default Next;