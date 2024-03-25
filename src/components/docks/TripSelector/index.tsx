import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import {ITripSelectorProps} from "./defs";
import {useStyles} from "./styles";
import LightDockSelector from "../LightDockSelector";
import {mergeClasses} from "@fluentui/react-components";

const LANG_PATH: string = "components.TripSelector";
const strings = {};
const TripSelector = ({from, dest, onFromChange, onDestinationChange}: ITripSelectorProps): React.JSX.Element => {
    const {t: translate} = useTranslation();
    const t = (key: string): string => translate(LANG_PATH + "." + key);
    const styles = useStyles();

    return (<div className={mergeClasses("map-header", styles.root)}>
        <div className="draw_c">
            <div className="a"></div>
            <div className="b">
                <i className={mergeClasses("firstDot", styles.firstDot)}></i>
            </div>
            <div className="c">
                <i className={mergeClasses("line", styles.line)}></i>
            </div>
            <div className="d">
                <i className={mergeClasses("lastDot", styles.lastDot)}></i>
            </div>
            <div className="e"></div>
        </div>
        <div className="sels">
            <div className="ldsSpace"></div>
            <LightDockSelector placeholder={translate("components.Next.placeholder.from")} onChange={onFromChange} value={from} langPath={""}/>
            <div className="ldsMid"></div>
            <LightDockSelector placeholder={translate("components.Next.placeholder.to")} value={dest} onChange={onDestinationChange} langPath={""}/>
            <div className="ldsSpace"></div>
        </div>
    </div>);
};
export default TripSelector;