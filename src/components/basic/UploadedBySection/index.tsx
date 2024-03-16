import React from "react";
import UserLink from "../../user/UserLink";
import {IUser} from "../../../data/models/user";
import {IUploadedBySectionProps} from "./defs";
import {useTranslation} from "react-i18next";
import {log} from "../../page/definitions";

const LANG_PATH: string = "components.basics.UploadedBySection";
const UploadedBySection = ({ user, username }: IUploadedBySectionProps): React.JSX.Element => {
    log("UploadedBySection");
    const { t: translate } = useTranslation();
    const t = (key: string): string => translate(LANG_PATH + "." + key);

    const strings = {
        label: "label"
    };

    return (<div className="jBar">
        <div className="l">{t(strings.label)}</div>
        <div className="r">
            <UserLink data={typeof user === "string" ? null : user} from={username?? (user as IUser).username} />
        </div>
    </div>);
};
export default UploadedBySection;