import {makeStyles, tokens} from "@fluentui/react-components";
import {Myself} from "../../../App";

export interface IBoatPageProps {
    toasterId: string;
    me: Myself;
}

export const useStyles = makeStyles({
    disableBtn: {
        color: tokens.colorPaletteRedBackground3
    },
    enableBtn: {
        color: tokens.colorPaletteGreenBackground3
    }
});