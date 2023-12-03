'use strict';
import {MDCDialog} from "../components.js";

export default class FloatingSheet {
    static getRandomId(prefix = "") {
        let str = prefix + "__"
        str += (Math.random() + 1).toString(36).substring(2);
        let ln = (document.querySelectorAll(`#${str}`).length);
        str += ln === 0 ? "" : ln;
        return str.replaceAll(".", "_");
    }
    constructor() {
        const id = FloatingSheet.getRandomId("FloatingSheet");
        this.getId = () => id;
    }
    initRoot() {
        const element = document.createElement("div");
        element.classList.add("mdc-dialog", "mdc-dialog--sheet", "mdc-dialog--no-contentd-padding", "mdc-dialog--fullscreen");
        element.setAttribute("aria-modal", "true");
        element.setAttribute("aria-labelledby", 0);
        element.setAttribute("aria-describedby", 0);
        element.id = this.getId();
        return element;
    }
    initScrim() {
        const element = document.createElement("div");
        element.classList.add("mdc-dialog__scrim");
        element.setAttribute("data-mdc-dialog-action", "cancel");
        return element;
    }
    initContainer() {
        const element = document.createElement("div");
        element.classList.add("mdc-dialog__container");
        return element;
    }
    initSurface() {
        const surface = document.createElement("div");
        surface.classList.add("mdc-dialog__surface");
        surface.setAttribute("tabindex", "-1");
        return surface;
    }
    initCloseButton() {
        const element = document.createElement("button");
        element.classList.add("mdc-icon-button", "material-icons", "mdc-dialog__close");
        element.setAttribute("data-mdc-dialog-action", "close");
        element.innerText = "close";
        return element;
    }
    initContent() {
        const element = document.createElement("div");
        element.classList.add("mdc-dialog__content");
        this.getContent = () => element;
        return element;
    }

    init() {
        const root = this.initRoot();
        const scrim = this.initScrim();
        const container = this.initContainer();
        const surface = this.initSurface();
        const closeButton = this.initCloseButton();
        const content = this.initContent();

        content.prepend(closeButton);
        surface.append(content);
        container.append(surface);
        root.append(scrim, container);

        document.body.append(root);

        const material = new MDCDialog(root);
        this.material = material;
        this.open = () => material.foundation.open();
        this.close = () => material.foundation.close();

    }
}