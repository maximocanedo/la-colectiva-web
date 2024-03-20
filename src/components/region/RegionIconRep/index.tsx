import {RegionIconRepProps} from "./defs";
import {Avatar, Body1, Subtitle1} from "@fluentui/react-components";
import {Water32Filled} from "@fluentui/react-icons";
import React from "react";
import {getRegionTypeLangPathNameFor} from "../../../page/RegionPage/defs";
import {useTranslation, UseTranslationResponse} from "react-i18next";
import {log} from "../../page/definitions";
import WelcomingTitle from "../../basic/WelcomingTitle";
import WelcomingTitle2 from "../../basic/WelcomingTitle2";

const RegionIconRep = (props: RegionIconRepProps): React.JSX.Element => {
    log("RegionIconRep");
    const { name, type, region }: RegionIconRepProps = props;
    const { t }: UseTranslationResponse<"translation", undefined> = useTranslation();

    if(region === null) return (<></>);
    const regionType: string = typeof type !== 'undefined' ? getRegionTypeLangPathNameFor(type) : "models.region.types.unknown";
    const fullName: string = t("models.region.longName").replace("%type", t(regionType)).replace("%name", name);

    return (<WelcomingTitle2 content={fullName} />);
};
export default RegionIconRep;