"use strict";

// PENDIENTE TERMINAR
import {MDCDialog} from "../components.js";

export default class FullscreenDialog {
    static getRandomId(prefix = "") {
        let str = prefix + "__"
        str += (Math.random() + 1).toString(36).substring(2);
        let ln = (document.querySelectorAll(`#${str}`).length);
        str += ln === 0 ? "" : ln;
        return str.replaceAll(".", "_");
    }
    constructor(title, actions, options = {closeButton: true}) {
        this.actions = actions == null || actions.length === 0 ? [
            new FullscreenDialog.DialogButton("Cancelar", "cancel"),
            new FullscreenDialog.DialogButton("Aceptar", "ok")
        ] : actions;
        this.options = {...options};
        const id = FullscreenDialog.getRandomId("FullscreenDialog");
        this.getId = () => id;
        this.getTitleId = () => id + "__title";
        this.getTitle = () => title;
        this.getContentId = () => id + "__content";
        const content = this.createContent();
        this.getContent = () => content;
    }
    static DialogButton = class {
        constructor(text, action) {
            const button = document.createElement("button");
            const ripple = document.createElement("div");
            const label = document.createElement("span");
            button.classList.add("mdc-button", "mdc-dialog__button");
            button.setAttribute("data-mdc-dialog-action", action);
            ripple.classList.add("mdc-button__ripple");
            label.classList.add("mdc-button__label");
            label.innerText = text;
            button.append(ripple, label);
            this.render = () => button;
        }
    }
    createCloseButton() {
        if(this.options.closeButton !== null && !this.options.closeButton) return "";
        const button = document.createElement("button");
        button.classList.add("mdc-icon-button", "material-icons", "mdc-dialog__close");
        button.setAttribute("data-mdc-dialog-action", "close");
        return button;
    }
    createContainer() {
        const container = document.createElement("div");
        container.classList.add("mdc-dialog__container");
        return container;
    }
    createSurface() {
        const surface = document.createElement("div");
        surface.classList.add("mdc-dialog__surface");
        surface.setAttribute("role", "dialog");
        surface.setAttribute("aria-modal", "true");
        surface.setAttribute("aria-labelledby", this.getTitleId());
        surface.setAttribute("aria-describedby", this.getContentId());
        surface.setAttribute("tab-index", "-1");
        return surface;
    }
    createHeader() {
        const header = document.createElement("div");
        header.classList.add("mdc-dialog__header");
        return header;
    }
    createTitle() {
        const title = document.createElement("h2");
        title.classList.add("mdc-dialog__title");
        title.innerText = this.getTitle();
        return title;
    }
    createContent() {
        const content = document.createElement("div");
        content.classList.add("mdc-dialog__content");
        this.setContent = (html) => content.innerHTML = html;
        this.insertInContent = (...arr) => content.append(...arr);
        return content;
    }
    createActionsSection() {
        const actions = document.createElement("div");
        actions.classList.add("mdc-dialog__actions");
        this.actions.map(action => {
            actions.append(action.render());
        });
        return actions;
    }
    createScrim() {
        const scrim = document.createElement("div");
        scrim.classList.add("mdc-dialog__scrim");
        return scrim;
    }
    createRootDialogElement() {
        const dialog = document.createElement("div");
        dialog.classList.add("mdc-dialog", "mdc-dialog--fullscreen");
        dialog.id = this.getId();
        return dialog;
    }
    init() {
        // Elementos
        const dialog = this.createRootDialogElement();
        const container = this.createContainer();
        const surface = this.createSurface();
        const header = this.createHeader();
        this.getHeader = () => header;
        const title = this.createTitle();
        const closeButton = this.createCloseButton();
        const content = this.getContent();
        const actions = this.createActionsSection();
        // DialogButton
        const scrim = this.createScrim();
        header.append(title, closeButton);
        surface.append(header, content, actions);
        container.append(surface);
        dialog.append(container, scrim);
        document.body.append(dialog);
        this.material = new MDCDialog(dialog);
        return this.material;

    }
}