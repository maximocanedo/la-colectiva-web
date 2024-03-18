import {makeStyles, shorthands, tokens} from "@fluentui/react-components";

export const useStyles = makeStyles({
    root: {},
    startDot: {
        backgroundColor: tokens.colorNeutralStencil1
    },
    endDot: {
        backgroundColor: tokens.colorBrandBackground
    },
    line: {
        ...shorthands.borderColor(tokens.colorNeutralStencil1)
    }
});