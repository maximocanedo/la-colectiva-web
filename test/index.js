import {MDCDrawer, MDCTopAppBar} from "../components/material/components.js";
import {getActualUser} from "../components/Auth.js";


(async () => {
    const user = await getActualUser();
    document.querySelectorAll('[data-user="name"]').forEach(el => el.innerText = user.name);
    const drawer = MDCDrawer.attachTo(document.querySelector('.mdc-drawer'));
    const topAppBarElement = document.querySelector('.mdc-top-app-bar');
    const topAppBar = new MDCTopAppBar(topAppBarElement);
    console.log({drawer, topAppBar});
    document.querySelector("#openDrawer").addEventListener('click', e => {
        drawer.open = !drawer.open;
    });
})();