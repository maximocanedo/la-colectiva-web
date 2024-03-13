import {IBoatIconRepProps} from "./defs";
import {Avatar, Body1, Subtitle1} from "@fluentui/react-components";
import {VehicleShipFilled} from "@fluentui/react-icons";
import React from "react";
import * as enterprises from "../../../data/actions/enterprise";
import {useTranslation, UseTranslationResponse} from "react-i18next";
import {log} from "../../page/definitions";

const BoatIconRep = (props: IBoatIconRepProps): React.JSX.Element => {
    log("BoatIconRep");
    const { name, mat, show }: IBoatIconRepProps = props;
    const { t }: UseTranslationResponse<"translation", undefined> = useTranslation();

    if(!(show?? true)) return (<></>);
    return (
        <div className="flex-down flx-cnt visual-rep">
            <Avatar className={"_avtar"} size={48} icon={<VehicleShipFilled />}/>
            <Subtitle1>{name}</Subtitle1>
            <Body1>{mat}</Body1>
        </div>);
};
export default BoatIconRep;