import React, {useEffect, useReducer, useState} from "react";
import {IEnterpriseSearchProps} from "./defs";
import {
    Avatar,
    Button,
    Input,
    Persona
} from "@fluentui/react-components";
import {useTranslation} from "react-i18next";
import {Add24Filled, Building20Filled, Search20Filled} from "@fluentui/react-icons";
import {IEnterprise} from "../../../data/models/enterprise";
import * as enterprises from "../../../data/actions/enterprise";
import LoadMoreButton from "../../../components/basic/buttons/LoadMoreButton";
import {NavigateFunction, useNavigate} from "react-router-dom";
import WelcomingTitle from "../../../components/basic/WelcomingTitle";
import {SearchBox} from "@fluentui/react-search-preview";
import EnterpriseFinder from "../../../components/enterprise/EnterpriseFinder";

const LANG_PATH: string = "pages.Enterprises";

const EnterpriseSearch = ({ me }: IEnterpriseSearchProps): React.JSX.Element => {
    const { t: translate } = useTranslation();
    const navigate: NavigateFunction = useNavigate();
    const t = (key: string): string => translate(LANG_PATH + "." + key);

    const canCreate: boolean =
        me !== undefined && me !== null
        && (me.active && me.role >= 2);
/// <BreadcrumbDivider />
    return (<div className={"page-content flex-down v2"}>
        <WelcomingTitle content={t("title")}/>
        <EnterpriseFinder
            onSelect={(enterprise: IEnterprise): void => {
                navigate("/enterprises/" + enterprise._id);
            }}
            creatable={canCreate} />
    </div>)
};
export default EnterpriseSearch;