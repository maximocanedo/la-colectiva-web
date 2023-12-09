'use strict';
import {MDCSnackbar} from "./components.js";

export default class Snackbar {
    constructor() {
    }
    render() {
        const aside = document.createElement("aside");
        const surface = document.createElement("div");
        const label = document.createElement("div");
        aside.classList.add("mdc-snackbar", "mdc-snackbar--leading");
        surface.classList.add("mdc-snackbar__surface");
        surface.setAttribute("role", "status");
        surface.setAttribute("aria-relevant", "additions");
        label.classList.add("mdc-snackbar__label");
        label.setAttribute("aria-atomic", "false");
        this.setText = text => label.innerText = text;
        surface.append(label);
        aside.append(surface);
        this.material = new MDCSnackbar(aside);
        return aside;
    }
    static init() {
        const snackbar = new Snackbar();
        if(document.querySelectorAll("aside.mdc-snackbar").length === 0) {
            document.body.append(snackbar.render());
            window.snackbar = snackbar.material;
            window.showSnackbar = message => {
                window.snackbar.labelText = (message);
                window.snackbar.open();
            }
        }
    }
}