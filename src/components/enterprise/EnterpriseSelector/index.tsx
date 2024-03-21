import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import {IEnterpriseSelectorProps} from "./defs";
import {
    Button,
    Dialog,
    DialogActions,
    DialogBody,
    DialogContent,
    DialogSurface,
    DialogTitle,
    DialogTrigger,
    useId
} from "@fluentui/react-components";
import {IEnterprise} from "../../../data/models/enterprise";
import {log} from "../../page/definitions";
import {ArrowSwapRegular} from "@fluentui/react-icons";
import EnterpriseFinder from "../EnterpriseFinder";

const LANG_PATH: string = "components.enterprise.EnterpriseSelector";

const EnterpriseSelector = ({ selected, onSelect }: IEnterpriseSelectorProps): React.JSX.Element => {
    log("EnterpriseSelector");
    const comboId = useId();
    const {t: translate} = useTranslation();
    const t = (key: string): string => translate(`${LANG_PATH}.${key}`);
    const [ open, setDialogOpenState ] = useState<boolean>(false);



    return <div id={comboId}>
        <Button
            onClick={(): void => setDialogOpenState(true)}
            iconPosition={"after"}
            icon={<ArrowSwapRegular/>}>
            {selected === null ? t("noselected") : selected.name?? ""}
        </Button>
        <Dialog open={open}>
            <DialogSurface>
                <DialogBody>
                    <DialogTitle>{t("placeholder")}</DialogTitle>
                    <DialogContent className={"flex-down v2"}>
                        <EnterpriseFinder creatable={false} onSelect={(data: IEnterprise): void => {
                            onSelect(data);
                            setDialogOpenState(false);
                        }}/>
                    </DialogContent>
                    <DialogActions>
                        <DialogTrigger disableButtonEnhancement>
                            <Button
                                onClick={(): void => setDialogOpenState(false)}
                                appearance="primary">{translate("actions.cancel")}</Button>
                        </DialogTrigger>
                    </DialogActions>
                </DialogBody>
            </DialogSurface>
        </Dialog>
    </div>
};
export default EnterpriseSelector;