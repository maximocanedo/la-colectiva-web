import React, {useRef, useState} from "react";
import {HeaderProps} from "./defs";
import CurrentUserSection from "./CurrentUserSection";
import { Button } from "@fluentui/react-components";
import {ArrowLeft32Regular, ListFilled} from "@fluentui/react-icons";
import { useStyles } from "./styles";
import { useNavigate } from 'react-router-dom';
import Drawer from "../Drawer";

const Header = ({ me }: HeaderProps): React.JSX.Element => {
    const classes = useStyles();
    const navigate = useNavigate();
    const [ open, setOpen ] = useState<boolean>(false);
    const back = () => {
        navigate(-1);
    }
    return (<header>
        <Drawer me={me} open={open} onUpdateOpenStatus={x => setOpen(x)} />
        <nav className={classes.leftNav}>
            <Button
                iconPosition={"before"}
                size={"large"}
                appearance={"subtle"}
                onClick={() => setOpen(true)}
                icon={<ListFilled />}></Button>

        </nav>
    </header>)
};
export default Header;