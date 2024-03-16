import {makeStyles, shorthands, tokens} from "@fluentui/react-components";

export const useStyles = makeStyles({
    root: {},
    toolbar: {
        display: "flex",
        alignItems: "center",
        ...shorthands.margin("0px", "10px"),
        justifyContent: "space-between",
        ...shorthands.gap("5px")
    },
    headerTitle: {
        marginTop: "20px"
    },
    body: {
        ...shorthands.margin("72px", "0px", "0px")
    },
    item: {
        width: "100%",
        justifyContent: "start"
    }
});