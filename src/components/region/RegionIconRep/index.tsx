import {RegionIconRepProps} from "./defs";
import {Avatar, Body1, Subtitle1} from "@fluentui/react-components";
import {Water32Filled} from "@fluentui/react-icons";
import React from "react";
import {getRegionTypeLangPathNameFor} from "../../../page/RegionPage/defs";
import {useTranslation, UseTranslationResponse} from "react-i18next";
import {log} from "../../page/definitions";

const RegionIconRep = (props: RegionIconRepProps): React.JSX.Element => {
    log("RegionIconRep");
    const { name, type, region }: RegionIconRepProps = props;
    const { t }: UseTranslationResponse<"translation", undefined> = useTranslation();

    if(region === null) return (<></>);
    const regionType: string = typeof type !== 'undefined' ? getRegionTypeLangPathNameFor(type) : "models.region.types.unknown";
    return (
        <div className="flex-down flx-cnt visual-rep">
            <Avatar className={"_avtar"} size={48} icon={<Water32Filled/>}/>
            <Subtitle1>{name}</Subtitle1>
            <Body1>{t(regionType)}</Body1>
        </div>);
};
export default RegionIconRep;