import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import {ISchedulePairProps} from "./defs";
import {useStyles} from "./styles";
import {Button, Link, mergeClasses} from "@fluentui/react-components";
import {ArrowRightRegular, ChevronDownRegular, ChevronUpRegular} from "@fluentui/react-icons";
import VoteManager from "../../basic/VoteManager";
import * as schedules from "../../../data/actions/schedule";
import {useNavigate} from "react-router-dom";

const LANG_PATH: string = "components.schedules.SchedulePair";
const strings = {
    moreInfo: "moreInfo",
    links: {
        outSchedule: "links.outSchedule",
        arrivalSchedule: "links.arrivalSchedule",
        path: "links.path"
    }
};
const SchedulePair = ({ me, dockOrigin, dockDestination, ...data }: ISchedulePairProps): React.JSX.Element => {
    const {t: translate} = useTranslation();
    const t = (key: string): string => translate(LANG_PATH + "." + key);
    const styles = useStyles();
    const [ expanded, setExpandedState ] = useState<boolean>(false);
    const navigate = useNavigate();
    const doName: string = typeof dockOrigin === "string" ? dockOrigin : dockOrigin.name;
    const ddName: string = typeof dockDestination === "string" ? dockDestination : dockDestination.name;

    const formatRelativeTime = (milliseconds: number): string => {
        const seconds = milliseconds / 1000;
        const minutes = seconds / 60;
        const hours = minutes / 60;
        const days = hours / 24;

        const rtf = new Intl.RelativeTimeFormat(translate("defLang"), { numeric: 'auto' });

        if (Math.abs(days) >= 1) {
            return rtf.format(Math.round(days), 'day');
        } else if (Math.abs(hours) >= 1) {
            return rtf.format(Math.round(hours), 'hour');
        } else if (Math.abs(minutes) >= 1) {
            return rtf.format(Math.round(minutes), 'minute');
        } else {
            return rtf.format(Math.round(seconds), 'second');
        }
    }

    return (<div className={mergeClasses(styles.root, "schedule-pair")}>
        <div className="header">
            {!expanded && <div className="col full-width">
                <div className="boldLine">{data.schedules[0].time} <ArrowRightRegular/> {data.schedules[1].time}
                </div>
                <div className="lightLine">{data.path.boat.name}</div>
            </div> }
            {expanded && <div className="col full-width">
                <div className="lightLine">{data.enterprise.name}</div>
                <div className="boldLine">{data.path.title}
                </div>
            </div>}
            <div className="col btn">
                <Button
                    onClick={(): void => setExpandedState(!expanded)}
                    appearance={"subtle"}
                    icon={expanded ? <ChevronUpRegular/> : <ChevronDownRegular/>}></Button>
            </div>
        </div>
        <div className={mergeClasses("body", !expanded ? "noDisplay" : "displaying")}>
            <div className="parnt">
                <div className="co-draw">
                    <div className="draw-container">
                        <div className="e_R">
                            <i className={mergeClasses("sP", styles.startDot)}></i>
                        </div>
                        <div className="e_L">
                            <i className={mergeClasses("line", styles.line)}></i>
                        </div>
                        <div className="e_D">
                            <i className={mergeClasses("sD", styles.endDot)}></i>
                        </div>
                    </div>
                </div>
                <div className="co-data">
                    <div className="firstScheduleData">
                        <div className="line">{data.schedules[0].time} · {doName}</div>
                        <VoteManager
                            me={me}
                            id={data.schedules[0]._id}
                            fetcher={schedules.votes.get}
                            upvoter={schedules.votes.upvote}
                            downvoter={schedules.votes.downvote} />
                    </div>
                    <div className="spaceBetween">
                        <span className="estimatedTime">{formatRelativeTime(data.duration)}</span>
                    </div>
                    <div className="lastScheduleData">
                        <div className="line">{data.schedules[1].time} · {ddName}</div>
                    </div>
                </div>
            </div>
            <div className="footer">
                <div className="co-draw"></div>
                <div className="co-data">
                    <div className="firstScheduleData f">
                        <VoteManager
                            me={me}
                            id={data.schedules[0]._id}
                            fetcher={schedules.votes.get}
                            upvoter={schedules.votes.upvote}
                            downvoter={schedules.votes.downvote} />
                    </div>
                    <div className="details">
                        <Link onClick={(): void => { navigate(`/enterprises/${data.enterprise._id}`) }}>{data.enterprise.name}</Link>
                        { " · " }
                        <Link onClick={(): void => { navigate(`/boats/${data.path.boat._id}`) }}>{data.path.boat.name}</Link>
                        <br/>
                        {t(strings.moreInfo)}
                        <Link onClick={(): void => { navigate(`/schedules/${data.schedules[0]._id}`) }}>{t(strings.links.outSchedule)}</Link>
                        { " · " }
                        <Link onClick={(): void => { navigate(`/schedules/${data.schedules[1]._id}`) }}>{t(strings.links.arrivalSchedule)}</Link>
                        { " · " }
                        <Link onClick={(): void => { navigate(`/paths/${data._id}`) }}>{t(strings.links.path)}</Link>
                    </div>
                </div>
            </div>
        </div>
    </div>);
};
export default SchedulePair;