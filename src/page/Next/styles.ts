import {makeStyles, shorthands, tokens} from "@fluentui/react-components";

export const useStyles = makeStyles({
    root: {},
    mapHeaderContainer: {
        zIndex: 50,
        backgroundColor: tokens.colorNeutralBackground1,
        ...shorthands.borderBottom("1px", "solid", tokens.colorNeutralStroke1Pressed)
    }
});