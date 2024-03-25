import {
    Avatar, Body1, Body1Strong,
    Button, CompoundButton, Divider,
    DrawerBody,
    DrawerHeader,
    DrawerHeaderNavigation,
    DrawerHeaderTitle, mergeClasses,
    OverlayDrawer, Persona, Toolbar
} from "@fluentui/react-components";
import {
    ArrowLeft32Regular, BuildingMultipleFilled,
    DataLineFilled,
    Dismiss24Regular,
    HomeFilled,
    LocationArrowFilled,
    VehicleShipFilled, WaterFilled
} from "@fluentui/react-icons";
import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import {IDrawerProps} from "./defs";
import {useStyles} from "./styles";
import {useNavigate} from "react-router-dom";
import ColectivaIconRound from "./../../../assets/round.svg";

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
    const close = (): void => onUpdateOpenStatus(false);
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
        <DrawerBody className={mergeClasses(styles.body, "drawer-body")}>
            <nav className={"drawer-body--firstNav"}>
                <Button
                    size={"large"}
                    appearance={"subtle"}
                    icon={<HomeFilled />}
                    onClick={(): void => {
                        navigate("/");
                        close();
                    }}
                    className={styles.item}>{t("links.home")}</Button>
                <Divider style={{ minHeight: "24px", maxHeight: "24px" }} />
                <Button
                    size={"large"}
                    appearance={"subtle"}
                    icon={<VehicleShipFilled />}
                    onClick={(): void => {
                        navigate("/boats");
                        close();
                    }}
                    className={styles.item}>{t("links.boats")}</Button>
                <Button
                    size={"large"}
                    appearance={"subtle"}
                    icon={<LocationArrowFilled />}
                    onClick={(): void => {
                        navigate("/docks");
                        close();
                    }}
                    className={styles.item}>{t("links.dockmap")}</Button>
                <Button
                    size={"large"}
                    appearance={"subtle"}
                    icon={<DataLineFilled />}
                    onClick={(): void => {
                        navigate("/paths");
                        close();
                    }}
                    className={styles.item}>{t("links.paths")}</Button>
                <Button
                    size={"large"}
                    appearance={"subtle"}
                    icon={<WaterFilled />}
                    onClick={(): void => {
                        navigate("/regions");
                        close();
                    }}
                    className={styles.item}>{t("links.paths")}</Button>
                <Button
                    size={"large"}
                    appearance={"subtle"}
                    onClick={(): void => {
                        navigate("/enterprises");
                        close();
                    }}
                    icon={<BuildingMultipleFilled />}
                    className={styles.item}>{t("links.enterprises")}</Button>


            </nav>
            <nav>
                <div className="col-brnd">
                    <img src="/round.svg" alt="Logo de La Colectiva" />
                    <div className="l">
                        <div className="row">
                            <Body1Strong>La Colectiva</Body1Strong>
                        </div>
                        <div className="row">
                            <Body1>Versión 24.3.1</Body1>
                        </div>
                    </div>
                </div>
            </nav>
        </DrawerBody>
    </OverlayDrawer>);
};
export default Drawer;