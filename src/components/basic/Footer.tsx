import React, {ReactNode, useState} from "react";
import {log, Myself} from "../page/definitions";
import {
    Button, Dialog,
    DialogActions,
    DialogBody,
    DialogContent,
    DialogSurface,
    DialogTitle,
    DialogTrigger,
    Link
} from "@fluentui/react-components";
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";
export interface FooterProps {
    me: Myself;
    logout(): void;
}
const strings = {
    nosession: "nosession",
    login: "login",
    signup: "signup",
    leave: "leave"
}
const Footer = ({ me, logout }: FooterProps): React.JSX.Element => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const loc: string = encodeURI(window.location.pathname);
    const [ loggingOut, setLoggingOutState ] = useState<boolean>(false);

    return (<footer className={""}>
        <Dialog open={loggingOut}>
            <DialogSurface>
                <DialogBody>
                    <DialogTitle>{t("footer.loggingout.title")}</DialogTitle>
                    <DialogContent>{t("footer.loggingout.description")}</DialogContent>
                    <DialogActions>
                        <DialogTrigger disableButtonEnhancement>
                            <Button
                                onClick={(): void => setLoggingOutState(false)}
                                appearance="secondary">{t("actions.close")}</Button>
                        </DialogTrigger>
                        <Button
                            onClick={(): void => {
                                logout();
                                setLoggingOutState(false);
                            }}
                            appearance="primary">{t("footer.actions.leave")}</Button>
                    </DialogActions>
                </DialogBody>
            </DialogSurface>
        </Dialog>
        <div className="row">
            {
                (me === null || me === undefined) &&
                <div className={"cell lgd"}>
                    <span>{ t("footer.st.nosession") }</span>
                    <Link onClick={(e) => navigate("/login?next="+loc)}>{ t("footer.actions.login") }</Link>
                    <Link onClick={(e) => navigate("/signup?next="+loc)}>{ t("footer.actions.signup") }</Link>
                </div>
            }
            {
                me !== null && me !== undefined && me.active &&
                <div className="cell lgd">
                    <span>{me.name} (@{me.username})</span>
                    <Link onClick={(e) => navigate("/users/me")}>{ t("footer.actions.me") }</Link>
                    <Link onClick={(e) => {
                        setLoggingOutState(true);
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
        <div className="row">
            <Link href={("https://www.facebook.com/com.max.colectiva")}>Facebook</Link>
            <Link href={("https://www.linkedin.com/company/la-colectiva-app")}>LinkedIn</Link>
        </div>
        <div className="row"><i>© Máximo Tomás Canedo</i></div>
    </footer>);
};
export default Footer;