import {
    Button, CompoundButton,
    DrawerBody,
    DrawerHeader,
    DrawerHeaderNavigation,
    DrawerHeaderTitle,
    OverlayDrawer, Toolbar
} from "@fluentui/react-components";
import {ArrowLeft32Regular, Dismiss24Regular, HomeFilled, VehicleShipFilled} from "@fluentui/react-icons";
import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import {IDrawerProps} from "./defs";
import {useStyles} from "./styles";
import {useNavigate} from "react-router-dom";
import CurrentUserSection from "../Header/CurrentUserSection";

const LANG_PATH: string = "components.Drawer";
const strings = {};
const Drawer = ({ open, onUpdateOpenStatus, me }: IDrawerProps): React.JSX.Element => {
    const {t: translate} = useTranslation();
    const t = (key: string): string => translate(LANG_PATH + "." + key);
    const styles = useStyles();
    const navigate = useNavigate();
    const back = () => {
        navigate(-1);
        onUpdateOpenStatus(false);
    }
    return (<OverlayDrawer
        position={"start"}
        open={open}
        onOpenChange={(_, { open }) => onUpdateOpenStatus(open)}
    >
        <DrawerHeader>
            <DrawerHeaderNavigation>
                <div className={styles.toolbar}>
                    <Button
                        iconPosition={"before"}
                        size={"large"}
                        appearance={"subtle"}
                        onClick={() => back()}
                        id={"root__BackButton"}
                        icon={<ArrowLeft32Regular />}></Button>
                    <Button
                        appearance="subtle"
                        aria-label="Close"
                        icon={<Dismiss24Regular />}
                        onClick={() => onUpdateOpenStatus(false)}
                    />
                </div>
            </DrawerHeaderNavigation>
        </DrawerHeader>
        <DrawerBody className={styles.body}>
            <br/>
            <Button
                size={"large"}
                appearance={"subtle"}
                icon={<HomeFilled />}
                className={styles.item}>Inicio</Button>
            <Button
                size={"large"}
                appearance={"subtle"}
                icon={<VehicleShipFilled />}
                className={styles.item}>Embarcaciones</Button>
            <br/>
            <br/>
            <CurrentUserSection onClick={() => onUpdateOpenStatus(false)} me={me} />
        </DrawerBody>
    </OverlayDrawer>);
};
export default Drawer;