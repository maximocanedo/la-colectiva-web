import React from "react";
import {useTranslation} from "react-i18next";
import {ISampleComponentProps} from "./defs";

const LANG_PATH: string = "";
const strings = {};
const Sample = ({}: ISampleComponentProps): React.JSX.Element => {
    const { t: translate } = useTranslation();
    const t = (key: string): string => translate(`${LANG_PATH}.${key}`);

    return (<></>);
};
export default Sample;