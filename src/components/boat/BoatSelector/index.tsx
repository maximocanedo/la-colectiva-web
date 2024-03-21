import React, {useEffect, useReducer, useState} from "react";
import {useTranslation} from "react-i18next";
import {IBoatSelectorProps} from "./defs";
import {
    Button,
    Combobox, Dialog, DialogActions, DialogBody, DialogContent, DialogSurface, DialogTitle, DialogTrigger,
    Option,
    OptionOnSelectData,
    Persona,
    SelectionEvents,
    useId
} from "@fluentui/react-components";
import {IBoat} from "../../../data/models/boat";
import LoadMoreButton from "../../basic/buttons/LoadMoreButton";
import {IPaginator} from "../../../data/models/comment";
import * as boats from "../../../data/actions/boat";
import {log} from "../../page/definitions";
import {ArrowSwapRegular} from "@fluentui/react-icons";
import EnterpriseFinder from "../../enterprise/EnterpriseFinder";
import {IEnterprise} from "../../../data/models/enterprise";
import BoatFinder from "../BoatFinder";

const LANG_PATH: string = "components.boat.BoatSelector";

const RegionSelector = ({ selected, onSelect }: IBoatSelectorProps): React.JSX.Element => {
    log("BoatSelector");
    const comboId = useId();
    const {t: translate} = useTranslation();
    const t = (key: string): string => translate(`${LANG_PATH}.${key}`);
    const [ open, setDialogOpenState ] = useState<boolean>(false);



    return <div id={comboId}>
        <Button
            onClick={(): void => setDialogOpenState(true)}
            iconPosition={"after"}
            icon={<ArrowSwapRegular/>}>
            {selected === null ? t("noselected") : selected.name ?? ""}
        </Button>
        <Dialog open={open}>
            <DialogSurface>
                <DialogBody>
                    <DialogTitle>{t("placeholder")}</DialogTitle>
                    <DialogContent className={"flex-down v2"}>
                        <BoatFinder creatable={false} onSelect={(data: IBoat): void => {
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
    </div>;
};
export default RegionSelector;