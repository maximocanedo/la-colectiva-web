import React, {ReactNode} from "react";
import {log} from "../page/definitions";
export interface FooterProps { }
const Footer = (props: FooterProps): React.JSX.Element => {
    log("Footer");
    return (<footer></footer>)
};
export default Footer;