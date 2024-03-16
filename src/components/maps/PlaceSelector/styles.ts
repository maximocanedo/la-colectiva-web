import {makeStyles, shorthands, tokens} from "@fluentui/react-components";

export const useStyles = makeStyles({
    root: {
        // @ts-ignore
        ...shorthands.borderColor(tokens.colorNeutralStroke1),
    }
});