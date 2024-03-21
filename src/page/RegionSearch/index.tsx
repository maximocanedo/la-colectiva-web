import React, {useEffect, useReducer, useState} from "react";
import {RegionSearchPageProps} from "./defs";
import {Avatar, Button, Card, CardPreview, Input, Persona, Subtitle2} from "@fluentui/react-components";
import {useTranslation} from "react-i18next";
import {Add24Filled, ArrowRightRegular, OpenRegular, Search20Filled, Water20Filled} from "@fluentui/react-icons";
import {IRegion} from "../../data/models/region";
import * as regions from "../../data/actions/region";
import LoadMoreButton from "../../components/basic/buttons/LoadMoreButton";
import {getRegionTypeLangPathNameFor} from "../RegionPage/defs";
import {NavigateFunction, useNavigate} from "react-router-dom";
import WelcomingTitle from "../../components/basic/WelcomingTitle";
import {SearchBox} from "@fluentui/react-search-preview";
import RegionFinder from "../../components/region/RegionFinder";

const LANG_PATH: string = "pages.Regions";

const RegionSearch = ({ me }: RegionSearchPageProps): React.JSX.Element => {
    const { t: translate } = useTranslation();

    const navigate: NavigateFunction = useNavigate();
    const t = (key: string): string => translate(LANG_PATH + "." + key);

    const canCreate: boolean =
        me !== undefined && me !== null
        && (me.active && me.role >= 2);

    return (<div className={"page-content flex-down v2"}>
        <WelcomingTitle content={t("title")} />
        <RegionFinder
            creatable={canCreate}
            onSelect={(region: IRegion): void => { navigate("/regions/" + region._id) }}
            icon={<ArrowRightRegular />}
            />
    </div>)
};
export default RegionSearch;