'use strict';

import UserPage from "../../components/user/UserPage.js";

(async () => {
    const searchParams = new URLSearchParams(window.location.search);
    const user = searchParams.get("name");
    const page = await UserPage.load(user);
    console.log(page);
    const el = "";
    document.querySelector("main").append(el);
})();