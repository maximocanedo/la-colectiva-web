import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {IDockExploreProps} from "./defs";
import {useStyles} from "./styles";
import DockSelector from "../../../components/docks/DockSelector";
import {IDockMinimal} from "../../../data/actions/dock";
import header from "../../../components/basic/Header";
import {useNavigate} from "react-router-dom";
import {Button} from "@fluentui/react-components";
import {AddRegular} from "@fluentui/react-icons";

const LANG_PATH: string = "pages.docks.DockExplore";
const strings = {
    addButton: "addButton"
};
const DockExplore = ({ me, sendToast }: IDockExploreProps): React.JSX.Element => {
    const {t: translate} = useTranslation();
    const t = (key: string): string => translate(LANG_PATH + "." + key);
    const styles = useStyles();
    const navigate = useNavigate();

    const canAdd: boolean = me !== null && me !== undefined && me.active && me.role >= 2;

    return (<div className={styles.root}>
        <DockSelector showAddButton={canAdd} onClick={(x: IDockMinimal): void => {
            navigate("/docks/" + x._id);
        }} />
    </div>);
};
export default DockExplore;