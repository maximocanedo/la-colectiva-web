import {makeStyles, shorthands, tokens} from "@fluentui/react-components";

export const useStyles = makeStyles({
    root: {},
    container: {
        display: "flex",
        flexDirection: "column",
        ...shorthands.gap("10px"),
    },
});