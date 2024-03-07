import * as user from "../../../data/actions/user";
import React, { useState, useEffect } from 'react';
import {IUser} from "../../../data/models/user";
import {Link, Spinner} from "@fluentui/react-components";
import {UserLinkProps} from "./defs";
import {StateManager} from "../../../page/SignUpPage/defs";


const USER_PROFILE_PAGE: string = "/users/";
const resolveUserProfilePageURL = (username: string): string => USER_PROFILE_PAGE + username;
const UserLink = (props: UserLinkProps): React.JSX.Element => {
    const { from, data }: UserLinkProps = props;
    const [userObj, setUserObj]: StateManager<IUser | null> = useState<IUser | null>(null);
    const [loading, setLoading]: StateManager<boolean> = useState<boolean>(true);

    useEffect(() => {
        let isMounted: boolean = true;
        if(data !== null || from === undefined) {
            setUserObj(data as IUser);
            setLoading(false);
            return;
        }
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
    }, [from, data]);

    if (loading) {
        return <Spinner size={"extra-tiny"}  />;
    }
    const username: string = from === undefined ? (data as IUser).username : from;

    if (!userObj) {
        return <Link disabled={true} href={resolveUserProfilePageURL(username)} {...props}>
           <s>@{from}</s>
        </Link>;
    }

    const { name }: IUser = userObj;

    return (
        <Link href={resolveUserProfilePageURL(username)} {...props}>
            {name}
        </Link>
    );
}

export default UserLink;