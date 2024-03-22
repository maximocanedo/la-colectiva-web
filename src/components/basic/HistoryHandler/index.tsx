import {IHistoryHandlerProps} from "./defs";
import React, {useEffect, useReducer, useState} from "react";
import {StateManager} from "../../../page/SignUpPage/defs";
import {useTranslation} from "react-i18next";
import {IHistoryEvent} from "../../../data/models/IHistoryEvent";
import HistoryEvent from "../HistoryEvent";
import LoadMoreButton from "../buttons/LoadMoreButton";
import {LoadState, log} from "../../page/definitions";
import LoadTriggerButton from "../buttons/LoadTriggerButton";

const eventsReducer = (state: IHistoryEvent[], action: { type: string, payload: IHistoryEvent | string }): IHistoryEvent[] => {
    switch(action.type) {
        case "ADD":
            const newEvent: IHistoryEvent = action.payload as IHistoryEvent;
            const existingEventIndex: number = state.findIndex((comment: IHistoryEvent): boolean => comment._id === newEvent._id);
            if (existingEventIndex !== -1) {
                const newState: IHistoryEvent[] = [...state];
                newState[existingEventIndex] = newEvent;
                return newState;
            } else {
                return [ ...state, newEvent ];
            }
        default:
            return [ ...state ];
    }
};


const HistoryHandler = ({ id, fetcher, me }: IHistoryHandlerProps): React.JSX.Element => {
    log("HistoryHandler");
    const LANG_PATH = "components.history.handler";
    const { t: translationService } = useTranslation();
    const [ page, setPage ]: StateManager<number> = useState<number>(1);
    const size: number = 4;
    const [ loadState, setLoadState ] = useState<LoadState>("initial");
    const [ events, dispatchEvents ] = useReducer(eventsReducer, []);
    const add = (comment: IHistoryEvent) => dispatchEvents({ type: "ADD", payload: comment });


    const fetchEvents = (): void => {
        setLoadState("loading");
        fetcher(id, { p: page, itemsPerPage: size })
            .then((arr: IHistoryEvent[]): void => {
                arr.map((co: IHistoryEvent) => add(co));
                if(arr.length === size) {
                    setPage(page + 1);
                    setLoadState("loaded");
                } else setLoadState("no-data");
            }).catch(err => {
                console.error(err);
                setLoadState("err");
        });
    };
    useEffect(() => {
        fetchEvents();
    }, []);


    return <div className={"historyHandler"}>
            { events.map((c: IHistoryEvent) => (<HistoryEvent key={"HistoryEvent$" + c._id} {...c} time={new Date(c.time)} />)) }
            <LoadTriggerButton state={loadState} onClick={fetchEvents} />
    </div>;
};
export default HistoryHandler;