import * as user from "./../../data/actions/user";
import React, { useState, useEffect } from 'react';
import {IUser} from "../../data/models/user";
import {Link, Spinner} from "@fluentui/react-components";

export interface UserLinkProps {
    from: string;
}
const USER_PROFILE_PAGE: string = "/users?username=";
const resolveUserProfilePageURL = (username: string): string => USER_PROFILE_PAGE + username;

const UserLink = (props: UserLinkProps): React.JSX.Element => {
    const { from }: UserLinkProps = props;
    const [userObj, setUserObj] = useState<IUser | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        let isMounted: boolean = true;

        user.findByUsername(from)
            .then((userObj: IUser): void => {
                if (isMounted) {
                    setUserObj(userObj);
                    setLoading(false);
                }
            })
            .catch(err => {
                if (isMounted) {
                    setLoading(false);
                }
            });

        return () => {
            isMounted = false;
        };
    }, [from]);

    if (loading) {
        return <Spinner size={"extra-tiny"}  />;
    }

    if (!userObj) {
        return <Link disabled={true} href={resolveUserProfilePageURL(from)} {...props}>
           <s>@{from}</s>
        </Link>;
    }

    const { username, name } = userObj;

    return (
        <Link href={resolveUserProfilePageURL(username)} {...props}>
            {name}
        </Link>
    );
}

export default UserLink;