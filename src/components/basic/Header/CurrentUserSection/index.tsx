import React from 'react';
import {Role} from "../../../../data/models/user";
import {Avatar, CompoundButton} from "@fluentui/react-components";
import {useTranslation} from "react-i18next";
import {TFunction} from "i18next";
import {CurrentUserSectionProps} from "./defs";
import {useStyles} from "./styles";
import SignInSignUpButtonPair from "../../auth/SignInSignUpButtonPair";
import {log} from "../../../page/definitions";
import { useNavigate } from 'react-router-dom';


const USER_PROFILE_PAGE: string = "/users/";
const resolveUserProfilePageURL = (username: string): string => USER_PROFILE_PAGE + username;

const CurrentUserSection = ({ me, onClick }: CurrentUserSectionProps): React.JSX.Element => {
    log("CurrentUserSection");
    const styles = useStyles();
    const { t }: { t: TFunction<"translation", undefined> } = useTranslation();
    const navigate = useNavigate();

    const login = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
        const url: string = window.location.pathname;
        window.location.href = `/login?next=` + encodeURI(url);
    };
    const signup = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
        const url: string = window.location.pathname;
        window.location.href = `/signup?next=` + encodeURI(url);
    };
    if(!me) {
        return (<SignInSignUpButtonPair {...{ onClick }} />)
    }


    const role: string = !me ? "" : [
        t('components.user.UserButton.roles.observer'),
        t('components.user.UserButton.roles.normal'),
        t('components.user.UserButton.roles.moderator'),
        t('components.user.UserButton.roles.admin')
    ][me.role as Role];
    return (
        <CompoundButton
            appearance={"transparent"}
            secondaryContent={(!me ? t('components.user.UserButton.err.notFound') : role)}
            onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
                if(me !== null) {
                    navigate(resolveUserProfilePageURL("me"));
                    if(onClick) onClick();
                }
            }}
            icon={<Avatar name={!me ? "?" : me.name} />}
            iconPosition={"before"}
        >
            {me.name}
        </CompoundButton>
    );
}

export default CurrentUserSection;