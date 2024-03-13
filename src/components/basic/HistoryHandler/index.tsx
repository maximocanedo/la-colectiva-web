import {IHistoryHandlerProps} from "./defs";
import React, {useEffect, useReducer, useState} from "react";
import {StateManager} from "../../../page/SignUpPage/defs";
import {IComment, ICommentFetchResponse} from "../../../data/models/comment";
import Comment from "../Comment";
import {IUserMinimal} from "../Comment/defs";
import {Button, Spinner, Textarea} from "@fluentui/react-components";
import {Send24Filled} from "@fluentui/react-icons";
import {useTranslation} from "react-i18next";
import {IHistoryEvent} from "../../../data/models/IHistoryEvent";
import HistoryEvent from "../HistoryEvent";
import LoadMoreButton from "../buttons/LoadMoreButton";
import {log} from "../../page/definitions";

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
    const t = (path: string): string => translationService(LANG_PATH + "." + path);
    const [ page, setPage ]: StateManager<number> = useState<number>(1);
    const [ size, setSize ]: StateManager<number> = useState<number>(5);
    const [ downloading, setDownloadingState ]: StateManager<boolean> = useState<boolean>(false);
    const [ events, dispatchEvents ] = useReducer(eventsReducer, []);
    const add = (comment: IHistoryEvent) => dispatchEvents({ type: "ADD", payload: comment });


    const fetch = (p: number, itemsPerPage: number = size): void => {
        setDownloadingState(true);
        fetcher(id, { p, itemsPerPage })
            .then((arr: IHistoryEvent[]): void => {
                arr.map((co: IHistoryEvent) => add(co));
            }).catch(err => {}).finally((): void => {
                setDownloadingState(false);
        });
    };
    useEffect(() => {
        fetch(0, 3);
    }, []);

    const more = (): void => {
        setPage(page + 1);
        fetch(page);
    };

    return <div>
            { events.map((c: IHistoryEvent) => (<HistoryEvent key={"HistoryEvent$" + c._id} {...c} time={new Date(c.time)} />)) }
            <LoadMoreButton loading={downloading} onClick={more} />
    </div>;
};
export default HistoryHandler;