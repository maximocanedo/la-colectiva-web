import {IEnterpriseIconRepProps} from "./defs";
import {Avatar, Body1, Subtitle1} from "@fluentui/react-components";
import {Building32Filled} from "@fluentui/react-icons";
import React from "react";
import * as enterprises from "../../../data/actions/enterprise";
import {useTranslation, UseTranslationResponse} from "react-i18next";

const EnterpriseIconRep = (props: IEnterpriseIconRepProps): React.JSX.Element => {
    const { name, cuit, show }: IEnterpriseIconRepProps = props;
    const { t }: UseTranslationResponse<"translation", undefined> = useTranslation();

    if(!(show?? true)) return (<></>);
    return (
        <div className="flex-down flx-cnt visual-rep">
            <Avatar className={"_avtar"} size={48} icon={<Building32Filled />}/>
            <Subtitle1>{name}</Subtitle1>
            <Body1>{enterprises.formatCUIT(cuit)}</Body1>
        </div>);
};
export default EnterpriseIconRep;