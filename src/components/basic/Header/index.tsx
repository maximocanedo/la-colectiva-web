import React, {useRef, useState} from "react";
import {HeaderProps} from "./defs";
import CurrentUserSection from "./CurrentUserSection";
import { Button } from "@fluentui/react-components";
import {ArrowLeft32Regular, ListFilled} from "@fluentui/react-icons";
import { useStyles } from "./styles";
import { useNavigate } from 'react-router-dom';
import Drawer from "../Drawer";
import {SearchBox} from "@fluentui/react";

const Header = ({ me, showSearchBox, query, onSearch }: HeaderProps): React.JSX.Element => {
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

            { (showSearchBox?? false) && <SearchBox value={query?? ""} onSearch={onSearch} /> }

        </nav>
    </header>)
};
export default Header;