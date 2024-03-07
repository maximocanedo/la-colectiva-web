import {
    FluentProvider,
    webLightTheme,
    Button,
    makeStyles,
    shorthands,
    useId,
    Input,
    Label,
    InputProps,
} from "@fluentui/react-components";
import * as React from "react";
import UserLink from "../user/UserLink";

const useStyles = makeStyles({
    root: {
        // Stack the label above the field
        display: "flex",
        flexDirection: "column",
        // Use 2px gap below the label (per the design system)
        ...shorthands.gap("2px"),
        // Prevent the example from taking the full width of the page (optional)
        maxWidth: "400px",
    },
});
export function DialogSignUp (props: InputProps) {
    const inputId: string = useId("input");
    const styles: Record<"root", string> = useStyles();
    return (<div className={styles.root}>
        <Label htmlFor={inputId} size={props.size} disabled={props.disabled}>
            Nombre de usuario
        </Label>
        <Input id={inputId} {...props} />
    </div>);
}

export default function TestPage() {
    return (<div>
            <UserLink data={null} from={"root"} />
        </div>
    );
}