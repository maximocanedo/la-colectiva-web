import * as user from "./../../data/actions/user";
import React, {useState, useEffect, DOMAttributes} from 'react';
import {IUser, Role} from "../../data/models/user";
import {Avatar, CompoundButton, Link, makeStyles, Spinner} from "@fluentui/react-components";

export interface UserButtonProps extends DOMAttributes<Element> {
    from: string;
}
const USER_PROFILE_PAGE: string = "/users?username=";
const resolveUserProfilePageURL = (username: string): string => USER_PROFILE_PAGE + username;

const UserButton = (props: UserButtonProps): React.JSX.Element => {
    const { from }: UserButtonProps = props;
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
    }, [from])
    const role: string = !userObj ? "" : [ "Observador", "Usuario", "Moderador", "Administrador"][userObj.role as Role];
    return (
        <CompoundButton
            { ...props }
            secondaryContent={loading ? "Cargando..." : (!userObj ? "Usuario no encontrado." : role)}
            icon={loading ? <Spinner size={"extra-tiny"}  /> : <Avatar name={!userObj ? "?" : userObj.name} />}
            iconPosition={"before"}
        >
            {!userObj ? `@${from}` : userObj.name}
        </CompoundButton>
    );
}

export default UserButton;