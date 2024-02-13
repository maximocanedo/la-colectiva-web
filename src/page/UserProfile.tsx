import React from "react";
import {useParams} from "react-router-dom";
import UserButton from "../components/user/UserButton";
const UserProfile = () => {
    const username = useParams<{ username: string }>().username; // Obtiene el parámetro username de la URL

    return (
        <>
            <UserButton
                from={username as string}
                onClick={
                (e: React.MouseEvent<Element, MouseEvent>): void => {console.log({username, e});}
                }
            />
        </>
    );
};

export default UserProfile;