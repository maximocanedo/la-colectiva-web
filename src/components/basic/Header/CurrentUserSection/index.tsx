import * as users from "../../../../data/actions/user";
import React, {useState, useEffect} from 'react';
import {IUser, Role} from "../../../../data/models/user";
import {Avatar, Button, CompoundButton, Skeleton, SkeletonItem, Spinner} from "@fluentui/react-components";
import {StateManager} from "../../../../page/SignUpPage/defs";
import {useTranslation} from "react-i18next";
import {TFunction} from "i18next";
import {CurrentUserSectionProps} from "./defs";
import {useStyles} from "./styles";
import SignInSignUpButtonPair from "../../auth/SignInSignUpButtonPair";


const USER_PROFILE_PAGE: string = "/users/";
const resolveUserProfilePageURL = (username: string): string => USER_PROFILE_PAGE + username;

const CurrentUserSection = (props: CurrentUserSectionProps): React.JSX.Element => {
    const styles = useStyles();
    const { t }: { t: TFunction<"translation", undefined> } = useTranslation();
    const from: string = "me";
    const [user, setUser]: StateManager<IUser | null> = useState<IUser | null>(null);
    const [loading, setLoading]: StateManager<boolean> = useState<boolean>(true);

    useEffect((): void => {
        users.myself()
            .then((obj: IUser): void => {
                setUser(obj);
            })
            .catch((err): void => {
                console.error(err);
            })
            .finally((): void => {
                setLoading(false);
            });
    }, []);
    const login = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
        const url: string = window.location.pathname;
        window.location.href = `/login?next=` + encodeURI(url);
    };
    const signup = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
        const url: string = window.location.pathname;
        window.location.href = `/signup?next=` + encodeURI(url);
    };
    if(loading) {
        return (<div className={styles.invertedWrapper}>
            <Skeleton width={180}>
                <div className={styles.firstRow}>
                    <SkeletonItem size={32} shape={"circle"} />
                    <SkeletonItem size={24} shape={"rectangle"} />
                </div>
            </Skeleton>
        </div>)
    }
    if(!user) {
        return (<SignInSignUpButtonPair />)
    }


    const role: string = !user ? "" : [
        t('components.user.UserButton.roles.observer'),
        t('components.user.UserButton.roles.normal'),
        t('components.user.UserButton.roles.moderator'),
        t('components.user.UserButton.roles.admin')
    ][user.role as Role];
    return (
        <CompoundButton
            { ...props }
            appearance={"transparent"}
            secondaryContent={(!user ? t('components.user.UserButton.err.notFound') : role)}
            onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
                if(user !== null)
                    window.location.href = resolveUserProfilePageURL("me");
            }}
            icon={<Avatar name={!user ? "?" : user.name} />}
            iconPosition={"before"}
        >
            {!user ? `@${from}` : user.name}
        </CompoundButton>
    );
}

export default CurrentUserSection;