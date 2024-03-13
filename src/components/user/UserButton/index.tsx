import * as user from "../../../data/actions/user";
import React, {useState, useEffect, DOMAttributes} from 'react';
import {IUser, Role} from "../../../data/models/user";
import {Avatar, CompoundButton, Link, makeStyles, Spinner} from "@fluentui/react-components";
import {StateManager} from "../../../page/SignUpPage/defs";
import {useTranslation} from "react-i18next";
import {TFunction} from "i18next";
import {UserButtonProps} from "./defs";
import {NavigateFunction, useNavigate} from "react-router-dom";
import {log} from "../../page/definitions";


const USER_PROFILE_PAGE: string = "/users/";
const resolveUserProfilePageURL = (username: string): string => USER_PROFILE_PAGE + username;

const UserButton = (props: UserButtonProps): React.JSX.Element => {
    log("UserButton");
    const { t }: { t: TFunction<"translation", undefined> } = useTranslation();
    const { from }: UserButtonProps = props;
    const navigate: NavigateFunction = useNavigate();
    const [userObj, setUserObj]: StateManager<IUser | null> = useState<IUser | null>(null);
    const [loading, setLoading]: StateManager<boolean> = useState<boolean>(true);

    useEffect(() => {
        let isMounted: boolean = true;
        user.findByUsername(from)
            .then((userObj: IUser): void => {
                if (isMounted) {
                    setUserObj(userObj);
                    setLoading(false);
                }
            })
            .catch((): void => {
                if (isMounted) {
                    setLoading(false);
                }
            });
        return (): void => {
            isMounted = false;
        };
    }, [from])
    const role: string = !userObj ? "" : [
        t('components.user.UserButton.roles.observer'),
        t('components.user.UserButton.roles.normal'),
        t('components.user.UserButton.roles.moderator'),
        t('components.user.UserButton.roles.admin')
    ][userObj.role as Role];
    return (
        <CompoundButton
            { ...props }
            secondaryContent={loading ? t('loading') : (!userObj ? t('components.user.UserButton.err.notFound') : role)}
            onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
                if(userObj !== null)
                    navigate(resolveUserProfilePageURL((userObj as IUser).username));
            }}
            icon={loading ? <Spinner size={"extra-tiny"}  /> : <Avatar name={!userObj ? "?" : userObj.name} />}
            iconPosition={"before"}
        >
            {!userObj ? `@${from}` : userObj.name}
        </CompoundButton>
    );
}

export default UserButton;