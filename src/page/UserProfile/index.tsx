import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import * as users from "../../data/actions/user";
import {IUser} from "../../data/models/user";
import {Err} from "../../data/error";
import {Avatar, Persona} from "@fluentui/react-components";
import RoleSelector from "../../components/user/user-page/RoleSelector";
import EmailSection from "../../components/user/user-page/EmailSection";
import BioSection from "../../components/user/user-page/BioSection";
import NameSection from "../../components/user/user-page/NameSection";
const UserProfile = (): React.JSX.Element => {
    const username: string = useParams<{ username: string }>().username as string;
    const [user, setUser] = useState<IUser | null>(null);
    const [me, setMe] = useState<IUser | null>(null);
    const [ loaded, setLoaded ] = useState<boolean>(false);
    const [ name, setName ] = useState<string>("");
    useEffect(() => {
        users.findByUsername(username as string)
            .then((response: IUser): void => {
                setUser(response);
                setName(response.name);
            })
            .catch((error): void => {
                console.error(error);
            });
        users.myself()
            .then((response: IUser) => {
                setMe(response);

            })
            .catch((error): void => {
                console.error(error);
                setMe(null);
            });
        setLoaded(true);
    }, []);

    if (!loaded) {
        return (
            <div>Loading...</div>
        );
    }

    if (user === null) {
        return (
            <Persona
                textPosition="below"
                name={"@" + username}
                size={"huge"}
                avatar={<Avatar name={""} />}
                secondaryText={"Usuario no encontrado"}
            />
        );
    }

    return (
        <div className={"page-content flex-down"}>
            <Persona
                textPosition="below"
                name={name}
                size={"huge"}
                avatar={<Avatar name={name} />}
                secondaryText={"@" + user.username}
            />
            <br/>
            <NameSection user={user} me={me} onChange={(newName: string): void => setName(newName)} />
            <BioSection user={user} me={me} />
            <RoleSelector user={user} me={me} />
            <EmailSection user={user} me={me} />
        </div>
    );
};

export default UserProfile;