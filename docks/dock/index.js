"use strict";
import DockPage from "../../components/dock/DockPage.js";
import {MDCChip, MDCRipple} from "../../components/material/components.js";
//import ""

(async () => {
    const searchParams = new URLSearchParams(window.location.search);
    const id = searchParams.get("id");
    const page = await DockPage.load(id);
    document.querySelector("#root").append(page.render());
    page.initialize();
    document.querySelectorAll(".mdc-chip").forEach(element => {
        const e = new MDCChip(element);
        new MDCRipple(element);
    })
})();