import {makeStyles, shorthands, tokens} from "@fluentui/react-components";

export const useStyles = makeStyles({
    root: {},
    firstDot: {
        backgroundColor: tokens.colorNeutralStroke1Pressed
    },
    line: {
        backgroundColor: tokens.colorNeutralBackgroundDisabled
    },
    lastDot: {
        backgroundColor: tokens.colorNeutralStrokeAccessibleSelected
    }
});