"use strict";

const getActualUser = async () => {
    const userData = await fetch("https://colectiva.com.ar:5050/users/protected", {
       method: "GET",
       credentials: 'include',
       headers: {
           'Content-Type': "application/json"
       }
    });
    if(userData.status === 200) {
        const user = await userData.json();
        return user.user;
    }
    return null;
};
const roles = {
    ADMIN: 3,
    MODERATOR: 2,
    NORMAL: 1,
    LIMITED: 0
};
const getAdmin = async () => {
    const user = await getActualUser();
    return (user.role >= roles.ADMIN) ? user : null;
};
const getModerator = async () => {
    const user = await getActualUser();
    return (user.role >= roles.MODERATOR) ? user : null;
};
const getNormal = async () => {
    const user = await getActualUser();
    return (user.role >= roles.NORMAL) ? user : null;
};

export {
    roles,
    getActualUser,
    getAdmin,
    getModerator,
    getNormal
}