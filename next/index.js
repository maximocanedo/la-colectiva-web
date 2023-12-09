"use strict";
import SchedulePair from "../components/schedule/SchedulePair.js";
import DockSelect from "../components/dock/DockSelect.js";
import {MDCList} from "../components/material/components.js";
import ButtonView from "../components/material/ButtonView.js";
import BoatSelect from "../components/boat/BoatSelect.js";
import EnterpriseSelect from "../components/enterprise/EnterpriseSelect.js";

const oldCall = (async () => {

});
(async () => {
   const select = new DockSelect();
   await select.init();
   document.querySelector("#root").append(select.render());

    const select2 = new DockSelect();
    await select2.init();
    document.querySelector("#root").append(select2.render());

    const boatSelect = new BoatSelect();
    await boatSelect.init();
    document.querySelector("#root").append(boatSelect.render());
    const enterpriseSelect = new EnterpriseSelect();
    await enterpriseSelect.init();
    document.querySelector("#root").append(enterpriseSelect.render());

    const btn = new ButtonView("Buscar", {iconLeading: "search", raised: true});
    const btnEl = btn.getElement();
    btnEl.addEventListener("click", async (e) => {
        document.querySelector("#scheduleContainer").innerHTML = "";
        const apiURL = `http://colectiva.com.ar:5050/query/next?departure=${select.getSelectedId()}&arrival=${select2.getSelectedId()}&time=09:20&conditions[]=WEDNESDAY`;
        const data = await fetch(apiURL, {
            method: "GET",
            credentials: "include"
        });
        if(data.ok) {
            const schedules = await data.json();
            schedules.map(async (schedule) => {
                const pair = new SchedulePair(schedule);
                await pair.init();
                document.querySelector("#scheduleContainer").append(pair.render());
            });
        }
    });
    document.querySelector("#root").append(btnEl);

})();