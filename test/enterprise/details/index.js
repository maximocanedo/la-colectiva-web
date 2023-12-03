"use strict";

import EnterprisePage from "../../../components/EnterprisePage.js";
import TextField from "../../../components/material/TextField.js";

(async () => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    const e = await EnterprisePage.load(id);
    document.querySelector("#root").append(e.render());
})();