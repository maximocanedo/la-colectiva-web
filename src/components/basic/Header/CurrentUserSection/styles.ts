import {makeStyles, shorthands, tokens} from "@fluentui/react-components";

export const useStyles = makeStyles({
    invertedWrapper: {
        backgroundColor: tokens.colorNeutralBackground1,
    },
    firstRow: {
        alignItems: "center",
        display: "grid",
        marginRight: "90px",
        position: "relative",
        right: "0px",
        width: "80%",
        ...shorthands.gap("10px"),
        gridTemplateColumns: "min-content 80%",
    }
});