import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import {IDisableButtonProps} from "./defs";
import {useStyles} from "./styles";
import {Button,
    Dialog,
    DialogTrigger,
    DialogSurface,
    DialogTitle,
    DialogBody,
    DialogActions,
    DialogContent} from "@fluentui/react-components";

const LANG_PATH: string = "components.DisableButton";
const strings = {};
const DisableButton = ({ onClick, status }: IDisableButtonProps): React.JSX.Element => {
    const {t: translate} = useTranslation();
    const t = (key: string): string => translate(LANG_PATH + "." + key);
    const [ open, setOpen ] = useState<boolean>(false);
    const styles = useStyles();

    return <Dialog open={open}>
        <DialogTrigger disableButtonEnhancement>
            <Button
                className={status ? styles.disableBtn : styles.enableBtn}
                onClick={(): void => setOpen(!open)}
                appearance={"secondary"}>
                {status ? translate("actions.disable") : translate("actions.enable")}
            </Button>
        </DialogTrigger>
        <DialogSurface>
            <DialogBody>
                <DialogTitle>{t(status ? "before.disable.title" : "before.enable.title")}</DialogTitle>
                <DialogContent>{t(status ? "before.disable.description" : "before.enable.description")}</DialogContent>
                <DialogActions>
                    <DialogTrigger disableButtonEnhancement>
                        <Button
                            onClick={(): void => setOpen(!open)}
                            appearance="secondary">{translate("actions.cancel")}</Button>
                    </DialogTrigger>
                    <Button onClick={(): void => {
                        setOpen(!open);
                        onClick();
                    }} appearance="primary">{status ? translate("actions.disable") : translate("actions.enable")}</Button>
                </DialogActions>
            </DialogBody>
        </DialogSurface>
    </Dialog>
};
export default DisableButton;