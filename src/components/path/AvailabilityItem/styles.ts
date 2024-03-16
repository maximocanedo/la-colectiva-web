import {makeStyles, shorthands, tokens} from "@fluentui/react-components";

export const useStyles = makeStyles({
    root: {},
    ok: {
        color: tokens.colorStatusSuccessBackground3
    },
    err: {
        color: tokens.colorPaletteCranberryBorderActive
    }
});