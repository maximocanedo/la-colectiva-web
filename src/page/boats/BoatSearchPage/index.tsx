import React, {useEffect, useReducer, useState} from "react";
import {useTranslation} from "react-i18next";
import {IBoatSearchPageProps} from "./defs";
import {useStyles} from "./styles";
import {Avatar, Button, Input, Persona} from "@fluentui/react-components";
import {Add24Filled, Building20Filled, Search20Filled} from "@fluentui/react-icons";
import {IBoat} from "../../../data/models/boat";
import * as boats from "../../../data/actions/boat";
import {IEnterprise} from "../../../data/models/enterprise";
import * as enterprises from "../../../data/actions/enterprise";
import LoadMoreButton from "../../../components/basic/buttons/LoadMoreButton";
import {useNavigate} from "react-router-dom";
import BoatList from "../../../components/boat/BoatList";
import WelcomingTitle from "../../../components/basic/WelcomingTitle";
import {SearchBox} from "@fluentui/react-search-preview";
import BoatFinder from "../../../components/boat/BoatFinder";

const LANG_PATH: string = "pages.boats.SearchPage";

const BoatSearchPage = ({ me }: IBoatSearchPageProps): React.JSX.Element => {
    const {t: translate} = useTranslation();
    const t = (key: string): string => translate(LANG_PATH + "." + key);
    const styles = useStyles();
    const navigate = useNavigate();

    const canCreate: boolean = (me !== null && me !== undefined && me.active && me.role >= 2);

    return (<div className={"page-content flex-down"}>
        <WelcomingTitle content={t("title")}/>
        <BoatFinder creatable={canCreate} onSelect={({ _id }: IBoat): void => {
            navigate("/boats/" + _id);
        }} />
    </div>);
};
export default BoatSearchPage;