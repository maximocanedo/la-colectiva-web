import {makeStyles, shorthands} from "@fluentui/react-components";

export const useStyles = makeStyles({
    leftNav: {
        display: "flex",
        justifyContent: "start",
        alignItems: "center",
        height: "100%",
        ...shorthands.gap("20px"),
        width: "max-content"
    }
});