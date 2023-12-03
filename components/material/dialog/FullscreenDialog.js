"use strict";

// PENDIENTE TERMINAR
export default class FullscreenDialog {
    static getRandomId(prefix = "") {
        let str = prefix + "__"
        str += (Math.random() + 1).toString(36).substring(2);
        let ln = (document.querySelectorAll(`#${str}`).length);
        str += ln === 0 ? "" : ln;
        return str.replaceAll(".", "_");
    }
    constructor() {
        const id = FullscreenDialog.getRandomId("FullscreenDialog");
        this.getId = () => id;
        this.getTitleId = () => id + "__title";
        this.getContentId = () => id + "__content";
    }
    static DialogButton = class {
        constructor(text) {
            <button type="button" className=" mdc-dialog__button"
                    data-mdc-dialog-action="ok">
                <div className="mdc-button__ripple"></div>
                <span className="mdc-button__label">OK</span>
            </button>
            const button = document.createElement("button");
            const ripple = document.createElement("div");
            const label = document.createElement("span");
            button.classList.add("mdc-button", "mdc-dialog__button");
            button.setAttribute("data-mdc-dialog-action", "")
        }
    }
    createCloseButton() {
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
        return title;
    }
    createContent() {
        const content = document.createElement("div");
        content.classList.add("mdc-dialog__content");
        return content;
    }
    createActionsSection() {
        const actions = document.createElement("div");
        actions.classList.add("mdc-dialog__actions");
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
        const dialog = document.createElement("div");
        const container = this.createContainer();
        const surface = this.createSurface();
        const header = this.createHeader();
        const title = this.createTitle();
        const closeButton = this.createCloseButton();
        const content = this.createContent();
        const actions = this.createActionsSection();
        // DialogButton
        const scrim = this.createScrim();


    }
}