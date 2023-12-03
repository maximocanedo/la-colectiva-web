'use strict';
import {MDCRipple} from "./components.js";

export default class IconButtonView {
    constructor(icon) {
        this.getIcon = () => icon;
        const button = document.createElement("button");
        this.getButton = () => button;
    }
    disable() {
        this.getButton().disabled = true;
    }
    enable() {
        this.getButton().disabled = false;
    }
    render() {
        const button = this.getButton();
        this.addEventListener = (event, handler, options) => button.addEventListener(event, handler, options);
        const ripple = document.createElement("div");
        const focusRing = document.createElement("span");
        const icon = document.createElement("i");

        button.classList.add("mdc-icon-button");
        ripple.classList.add("mdc-icon-button__ripple");
        focusRing.classList.add("mdc-icon-button__focus-ring");
        icon.classList.add("material-icons");

        icon.innerText = this.getIcon();

        button.append(ripple, focusRing, icon);

        return button;
    }
}