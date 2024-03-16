import React from "react";
import {useTranslation} from "react-i18next";
import {IBoatListItemProps} from "./defs";
import {useStyles} from "./styles";
import {Avatar, Button, Persona} from "@fluentui/react-components";
import {Building20Filled} from "@fluentui/react-icons";

const LANG_PATH: string = "components.BoatListItem";
const strings = {};
const BoatListItem = ({ onClick, ...data }: IBoatListItemProps): React.JSX.Element => {
    const {t: translate} = useTranslation();
    const t = (key: string): string => translate(LANG_PATH + "." + key);
    const styles = useStyles();

    return (<Button
                className={styles.root + " fullWidth fstart "}
                key={"boatListItem$" + data._id}
                onClick={(_e) => {
                    onClick(data);
                }}
                appearance={"subtle"}>
            <Persona
                textPosition={"after"}
                avatar={<Avatar
                            className={"_avtar"}
                            size={48}
                            icon={<Building20Filled/>} />}
                name={data.name}
                secondaryText={data.mat} />
        </Button>);
};
export default BoatListItem;