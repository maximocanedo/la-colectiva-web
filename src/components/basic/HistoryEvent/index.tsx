import React from "react";
import {IHistoryEventProps} from "./defs";
import {Avatar} from "@fluentui/react-components";
import UserLink from "../../user/UserLink";
import {useTranslation} from "react-i18next";
import {log} from "../../page/definitions";

function getTimePassed(date: Date): [number, Intl.RelativeTimeFormatUnit] {
    const now = Date.now();
    const diff =  (now - date.getTime());
    if (diff < 60000) { // Menos de un minuto
        return [0, 'minutes'];
    } else if (diff < 3600000) { // Menos de una hora
        return [ 0 - Math.floor(diff / 60000), 'minutes'];
    } else if (diff < 86400000) { // Menos de un día
        return [ 0 - Math.floor(diff / 3600000), 'hours'];
    } else if (diff < 604800000) { // Menos de una semana
        return [ 0 - Math.floor(diff / 86400000), 'days'];
    } else if (diff < 2629746000) { // Menos de un mes (asumiendo un mes de 30.44 días)
        return [ 0 - Math.floor(diff / 604800000), 'weeks'];
    } else if (diff < 31556952000) { // Menos de un año (asumiendo un año de 365.24 días)
        return [ 0 - Math.floor(diff / 2629746000), 'months'];
    } else { // Más de un año
        return [ 0 - Math.floor(diff / 31556952000), 'years'];
    }
}
const HistoryEvent = ({ _id: id, time: uploaded, content, user }: IHistoryEventProps): React.JSX.Element => {
    log("HistoryEvent");
    const LANG_PATH = "components.history.event";
    const { t: translationService } = useTranslation();
    const t = (path: string): string => translationService(LANG_PATH + "." + path);
    const lang: string = translationService("defLang");
    const rtf1 = new Intl.RelativeTimeFormat(lang, { numeric: 'auto' });
    const [ time, unit ] = getTimePassed(uploaded);
    const f: string = (time === 0 && unit === "minutes") ? translationService("now") : rtf1.format(time, unit);

    return (
        <div className="historyEvent">
            <span className="title">{content}</span>
            <div className="end">
                <Avatar name={user.name} size={16} />
                <UserLink data={user} from={user.username} />
                {" · "}
                <i>{f}</i>
            </div>
        </div>
    );
};
export default HistoryEvent;