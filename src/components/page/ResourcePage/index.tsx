import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import {IResourcePageProps} from "./defs";
import {useStyles} from "./styles";

const LANG_PATH: string = "components.ResourcePage";
const strings = {};
const ResourcePage = ({ children }: IResourcePageProps): React.JSX.Element => {
    const {t: translate} = useTranslation();
    const t = (key: string): string => translate(LANG_PATH + "." + key);
    const styles = useStyles();

    return (<div className={"resource-page"}>
        <div className="headerBlank"></div>
        { children }
    </div>);
};
export default ResourcePage;