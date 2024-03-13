import {makeStyles, tokens} from "@fluentui/react-components";


import {ICommonPageProps} from "../../../components/page/definitions";

export interface IBoatPageProps extends ICommonPageProps {}

export const useStyles = makeStyles({
    disableBtn: {
        color: tokens.colorPaletteRedBackground3
    },
    enableBtn: {
        color: tokens.colorPaletteGreenBackground3
    }
});