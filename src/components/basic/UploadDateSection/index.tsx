import React from "react";
import {useTranslation} from "react-i18next";
import {IUploadDateSectionProps} from "./defs";
import {log} from "../../page/definitions";

const LANG_PATH: string = "components.basics.UploadDateSection";
const strings = {
    label: "label"
};
const UploadDateSection = ({ date }: IUploadDateSectionProps): React.JSX.Element => {
    log("UploadDateSection");
    const { t: translate } = useTranslation();
    const t = (key: string): string => translate(`${LANG_PATH}.${key}`);
    const formattedDate: string = new Intl.DateTimeFormat(translate("defLang"), {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long',
        hour: 'numeric',
        minute: 'numeric'
    }).format(new Date(date?? ""));
    return (<div className="jBar">
        <div className="l">{t(strings.label)}</div>
        <div className="r">{formattedDate}</div>
    </div>);
};
export default UploadDateSection;