import {ActiveSectionProps} from "./defs";
import React from "react";
import {Role} from "../../../../data/models/user";
import { FluentTheme } from "@fluentui/react";
import {
    Button,
    Dialog,
    DialogTrigger,
    DialogSurface,
    DialogTitle,
    DialogContent,
    DialogBody,
    DialogActions
} from "@fluentui/react-components";
import * as users from "../../../../data/actions/user";
import {CommonResponse} from "../../../../data/utils";
import {useTranslation, UseTranslationResponse} from "react-i18next";

const LANG_PATH: string = "components.user.user-page.ActiveSection";
const ActiveSection = (props: ActiveSectionProps): React.JSX.Element => {
    const { user, me, notify }: ActiveSectionProps = props;
    const { t: translationService }: UseTranslationResponse<"translation", undefined> = useTranslation();
    const t = (path: string): string => translationService(LANG_PATH + "." + path);


    if(user === null || !user.name || me === null) return <></>;
    const myRole: Role = me.role?? Role.OBSERVER;
    if(me.username !== user.username && myRole !== Role.ADMINISTRATOR)
        return <></>
    const itsMe: boolean = me.username === user.username;



    const disable = (_e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
        const p: Promise<CommonResponse> = itsMe ? users.disableMyself() : users.disable(user.username);
        p.then((response: CommonResponse): void => {
                if(response.success) {
                    notify(t('ok.disabled'), "success");
                    setTimeout((): void => {
                        window.location.href = "/"
                    }, 3000);
                } else {
                    notify(t('err.disable'), "error", t('err.try'));
                }
            })
            .catch((error): void => {
                notify(t('err.err'), "error", error.message + `(${error.code?? "S/N"})`);
            });
    };

    const btnColor: string = FluentTheme.palette.redDark;

    return (<>
        <div className="jBar">
            <div className="l">{t('title')}</div>
            <Dialog modalType="alert">
                <DialogTrigger disableButtonEnhancement>
                    <Button className={"r"} appearance={"primary"} color={btnColor}>
                        {t('labels.btnDisable')}
                    </Button>
                </DialogTrigger>
                <DialogSurface>
                    <DialogBody>
                        <DialogTitle>{t('p.dialog.title')}</DialogTitle>
                        <DialogContent>
                            {t('p.dialog.description')}
                            <br/>
                        </DialogContent>
                        <DialogActions>
                            <DialogTrigger disableButtonEnhancement>
                                <Button appearance="secondary">{t('labels.back')}</Button>
                            </DialogTrigger>
                            <Button appearance="primary" onClick={disable}>{t('labels.sure')}</Button>
                        </DialogActions>
                    </DialogBody>
                </DialogSurface>
            </Dialog>
        </div>
    </>);
};
export default ActiveSection;