import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import {IResourcePageBodyProps} from "./defs";
import {useStyles} from "./styles";

const LANG_PATH: string = "components.ResourcePageBody";
const strings = {};
const ResourcePageBody = ({ children }: IResourcePageBodyProps): React.JSX.Element => {
    const {t: translate} = useTranslation();
    const t = (key: string): string => translate(LANG_PATH + "." + key);
    const styles = useStyles();

    return (<div className="resource-page-content">
        {children}
    </div>);
};
export default ResourcePageBody;