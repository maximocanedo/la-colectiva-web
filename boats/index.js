'use strict';

import BoatPage from "../components/boat/BoatPage.js";

(async () => {
    const searchParams = new URLSearchParams(window.location.search);
    const id = searchParams.get("id");
    const boatPage = await BoatPage.load(id);
    document.querySelector("#root").append(boatPage.render());
})();