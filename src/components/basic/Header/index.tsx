import React, {ReactNode} from "react";
import {HeaderProps} from "./defs";
import CurrentUserSection from "./CurrentUserSection";

const Header = (props: HeaderProps): React.JSX.Element => {
    return (<header>
        <nav></nav>
        <nav className="hdr-cnt-chl">
            <CurrentUserSection />
        </nav>
    </header>)
};
export default Header;