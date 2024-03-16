import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import {IBoatListProps} from "./defs";
import {useStyles} from "./styles";
import BoatListItem from "../BoatListItem";

const LANG_PATH: string = "components.BoatList";
const strings = {};
const BoatList = ({ data, onClick }: IBoatListProps): React.JSX.Element => {
    const {t: translate} = useTranslation();
    const t = (key: string): string => translate(LANG_PATH + "." + key);
    const styles = useStyles();

    return (<div className={styles.root + " reg-vertical-list"}>
        {data.map(x => <BoatListItem key={"BoatListItem$$" + x._id} onClick={onClick} {...x} />)}
    </div>);
};
export default BoatList;