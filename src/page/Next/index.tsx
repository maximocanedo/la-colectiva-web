import React, {useEffect, useReducer, useState} from "react";
import {useTranslation} from "react-i18next";
import {INextParams, INextProps} from "./defs";
import {useStyles} from "./styles";
import {useParams} from "react-router-dom";
import {
    Dialog,
    DialogTrigger,
    DialogSurface,
    DialogTitle,
    DialogBody,
    DialogActions,
    DialogContent, Button, Checkbox, mergeClasses, Field, Input
} from "@fluentui/react-components";
import TripSelector from "../../components/docks/TripSelector";
import {DockPropertyStatus} from "../../data/models/dock";
import * as docks from "../../data/actions/dock";
import * as schedules from "../../data/actions/schedule";
import {ScheduleGroup} from "../../data/models/schedules";
import SchedulePair from "../../components/schedules/SchedulePair";
import {OptionsRegular} from "@fluentui/react-icons";
import {AvailabilityCondition} from "../../data/models/path";
import Screen from "../../components/screens/Screen";

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
const toStrTime = (date: Date) => {
    const hh: string = ("0" + date.getHours().toString()).slice(-2);
    const mm: string = ("0" + date.getMinutes().toString()).slice(-2);
    return `${hh}:${mm}`;
};
const getTodayInAVC = (): AvailabilityCondition => {
    return [
        AvailabilityCondition.SUNDAY,
        AvailabilityCondition.MONDAY,
        AvailabilityCondition.TUESDAY,
        AvailabilityCondition.WEDNESDAY,
        AvailabilityCondition.THURSDAY,
        AvailabilityCondition.FRIDAY,
        AvailabilityCondition.SATURDAY
    ][new Date().getDay()];
};

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
    const [ useCustomTime, setCustomTimeStatus ] = useState<boolean>(false);
    const [ time, setTime ] = useState(toStrTime(new Date(Date.now())));
    const [ showOptionsDialog, setOptionsDialogVisibility ] = useState<boolean>(false);
    const [ qCon, setCon ] = useState<AvailabilityCondition[]>([getTodayInAVC()]);
    const size: number = 5;
    let firstLoad: boolean = true;

    useEffect((): void => {
        if(firstLoad) {
            firstLoad = false;
            return;
        }
        dispatchSchedules({ type: CLEAR, payload: null });
        setPage(0);
    }, [ time, from, dest, qCon ]);


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
        if(_from === undefined || _from.length < 24 || _to === undefined || _to.length < 24) return;
        const f: string = _from?? from?._id;
        const t: string = _to?? dest?._id;
        const tt: string = useCustomTime ? time : toStrTime(new Date(Date.now()));
        schedules.next(f, t, tt, qCon)
            .then((arr: ScheduleGroup[]): void => {
                console.log(arr);
                arr.map(x => dispatchSchedules({ type: ADD, payload: x }));
                if(arr.length === size) setPage(page + 1);
            }).catch(err => console.error(err))
            .finally((): void => {

            });
    };

    useEffect((): void => {
        search();
    }, []);
    const conditions: AvailabilityCondition[] = [
        AvailabilityCondition.MONDAY,
        AvailabilityCondition.TUESDAY,
        AvailabilityCondition.WEDNESDAY,
        AvailabilityCondition.THURSDAY,
        AvailabilityCondition.FRIDAY,
        AvailabilityCondition.SATURDAY,
        AvailabilityCondition.SUNDAY,
        AvailabilityCondition.HOLIDAY
    ];

    return (<div className={"page-content flex-down"}>
        <div  className={mergeClasses(styles.mapHeaderContainer, "map-header-container")}>
            <div className="map-header-subcontainer">
                <TripSelector from={from} dest={dest} onFromChange={setFrom} onDestinationChange={setDestination}/>
                <div className="btns">
                    <Button
                        onClick={(): void => setOptionsDialogVisibility(!showOptionsDialog)}
                        appearance={"subtle"}
                        icon={<OptionsRegular />}
                        iconPosition={"before"}
                        >{translate("actions.options")}</Button>
                    <Button
                        onClick={(): void => search()}
                        disabled={_from === undefined || from === null || _from.length < 24
                            || _to === undefined || dest === null || _to.length < 24}
                        appearance={"primary"}>{translate("actions.search")}</Button>
                </div>
            </div>

        </div>
        <br/><br/><br/><br/><br/><br/>
        {
            data.length === 0 && <Screen title={t("err.emp.title")} description={t("err.emp.description")} />
        }
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
        <Dialog open={showOptionsDialog}>
            <DialogSurface>
                <DialogBody>
                    <DialogTitle>{t("label.optionsDialog")}</DialogTitle>
                    <DialogContent>
                        <Checkbox
                            label={t("label.useActualTime")}
                            onChange={(e,d): void => setCustomTimeStatus(!(d.checked))}
                            checked={!useCustomTime} />
                        { useCustomTime && <Field>
                            <Input
                                disabled={!useCustomTime}
                                type={"time"}
                                value={time}
                                onChange={(e, d): void => {
                                    setTime(d.value);
                                    console.log(d.value);
                                }} />
                        </Field>}
                        <br/><br/>
                        {
                            conditions.map(con =>
                                <Checkbox
                                    checked={qCon.indexOf(con) > -1}
                                    onChange={(e,d): void => {
                                        const exists: boolean = qCon.indexOf(con) > -1;
                                        if(exists) setCon([ ...qCon ].filter(x => x !== con));
                                        else setCon([ ...qCon, con ]);
                                    }}
                                    label={translate("av." + con.toLowerCase())} />)
                        }
                    </DialogContent>
                    <DialogActions>
                        <DialogTrigger disableButtonEnhancement>
                            <Button
                                onClick={(): void => {
                                    setOptionsDialogVisibility(!showOptionsDialog);
                                    search();
                                }}
                                appearance="primary">{translate("actions.close")}</Button>
                        </DialogTrigger>
                    </DialogActions>
                </DialogBody>
            </DialogSurface>
        </Dialog>
    </div>);
};
export default Next;