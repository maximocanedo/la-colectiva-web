import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import {IIconRepProps} from "./defs";
import {useStyles} from "./styles";
import {Avatar, Body1, Subtitle1} from "@fluentui/react-components";
import {DataLineRegular, LocationFilled} from "@fluentui/react-icons";

const LANG_PATH: string = "components.IconRep";
const strings = {};
const IconRep = ({ name, boatName }: IIconRepProps): React.JSX.Element => {
    const {t: translate} = useTranslation();
    const t = (key: string): string => translate(LANG_PATH + "." + key);
    const styles = useStyles();

    return (<div className="flex-down flx-cnt visual-rep">
        <Avatar className={"_avtar"} size={48} icon={<DataLineRegular />}/>
        <Subtitle1>{name}</Subtitle1>
        <Body1>{boatName}</Body1>
    </div>);
};
export default IconRep;