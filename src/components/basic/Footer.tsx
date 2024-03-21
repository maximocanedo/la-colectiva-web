import React, {ReactNode} from "react";
import {log, Myself} from "../page/definitions";
import {Link} from "@fluentui/react-components";
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";
export interface FooterProps {
    me: Myself;
}
const strings = {
    nosession: "nosession",
    login: "login",
    signup: "signup",
    leave: "leave"
}
const Footer = ({ me }: FooterProps): React.JSX.Element => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    return (<footer className={""}>
        <div className="row">
            {
                (me === null || me === undefined) &&
                <div className={"cell lgd"}>
                    <span>{ t("footer.st.nosession") }</span>
                    <Link onClick={(e) => navigate("/login")}>{ t("footer.actions.login") }</Link>
                    <Link onClick={(e) => navigate("/signup")}>{ t("footer.actions.signup") }</Link>
                </div>
            }
            {
                me !== null && me !== undefined && me.active &&
                <div className="cell lgd">
                    <span>{me.name} (@{me.username})</span>
                    <Link onClick={(e) => {
                        localStorage.removeItem("la-colectiva-token");
                        navigate("/");
                    }}>{ t("footer.actions.leave") }</Link>
                </div>
            }
        </div>
        <div className="row">
            <Link onClick={(e) => navigate("/boats")}>{t('footer.links.boats')}</Link>
            <Link onClick={(e) => navigate("/docks")}>{t('footer.links.docks')}</Link>
            <Link onClick={(e) => navigate("/paths")}>{t('footer.links.paths')}</Link>
            <Link onClick={(e) => navigate("/regions")}>{t('footer.links.regions')}</Link>
            <Link onClick={(e) => navigate("/enterprises")}>{t('footer.links.enterprises')}</Link>
            <Link onClick={(e) => navigate("/reports")}>{t('footer.links.reports')}</Link>
        </div>
        <div className="row"><i>© Máximo Tomás Canedo · Todos los derechos reservados </i></div>
    </footer>)
};
export default Footer;