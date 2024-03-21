import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import {IRegionSelectorProps} from "./defs";
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
import {IRegion} from "../../../data/models/region";
import {log} from "../../page/definitions";
import RegionFinder from "../RegionFinder";
import {getRegionTypeLangPathNameFor} from "../../../page/RegionPage/defs";
import {ArrowSwapRegular} from "@fluentui/react-icons";

const LANG_PATH: string = "components.region.RegionSelector";
const RegionSelector = ({ selected, onSelect }: IRegionSelectorProps): React.JSX.Element => {
    log("RegionSelector");
    const comboId = useId();
    const { t: translate } = useTranslation();
    const t = (key: string): string => translate(`${LANG_PATH}.${key}`);
    const [ open, setDialogOpenState ] = useState<boolean>(false);

    const typel: string = selected === null ? "" : (selected.type === undefined ? "" : translate(getRegionTypeLangPathNameFor((selected.type) as number)));
    const fullName: string = selected === null ? t("noselected") : translate("models.region.longName").replace("%type", typel).replace("%name", selected.name);

    return <div id={comboId}>
        <Button
            onClick={(): void => setDialogOpenState(true)}
            iconPosition={"after"}
            icon={<ArrowSwapRegular />}>
            {fullName}
        </Button>
        <Dialog open={open}>
            <DialogSurface>
                <DialogBody>
                    <DialogTitle>{t("placeholder")}</DialogTitle>
                    <DialogContent className={"flex-down v2"}>
                        <RegionFinder icon={null} creatable={false} onSelect={(data: IRegion): void => {
                            onSelect(data);
                            setDialogOpenState(false);
                        }} />
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
export default RegionSelector;