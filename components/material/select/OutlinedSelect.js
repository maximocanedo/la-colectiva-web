'use strict';
import DropdownIcon from "./DropdownIcon.js";
import SelectMenu from "./SelectMenu.js";
import {MDCSelect} from "../components.js";

export default class OutlinedSelect {
    static getRandomId(prefix = "") {
        let str = prefix + "__"
        str += (Math.random() + 1).toString(36).substring(2);
        let ln = (document.querySelectorAll(`#${str}`).length);
        str += ln === 0 ? "" : ln;
        return str.replaceAll(".", "_");
    }
    constructor(label = "", items = []) {
        const id = OutlinedSelect.getRandomId("OutlinedSelect");
        this.getId = () => id;
        this.getLabel = () => label;
        this.getItems = () => items;
        this.getSelectedTextId = () => id + "__selectedId";
        this.getLabelId = () => id + "__label";
    }
    createLabel() {
        const element = document.createElement("span");
        element.classList.add("mdc-floating-label");
        element.id = this.getLabelId();
        element.innerText = this.getLabel();
        return element;
    }
    createSelectedTextContainer() {
        const container = document.createElement("span");
        container.classList.add("mdc-select__selected-text-container");
        const text = document.createElement("span");
        text.classList.add("mdc-select__selected-text");
        text.id = this.getSelectedTextId();
        container.append(text);
        return container;
    }
    createNotchedOutline() {
        const element = document.createElement("span");
        element.classList.add("mdc-notched-outline");
        const leading = document.createElement("span");
        leading.classList.add("mdc-notched-outline__leading");
        const notch = document.createElement("span");
        notch.classList.add("mdc-notched-outline__notch");
        const label = this.createLabel();
        notch.append(label);
        const trailing = document.createElement("span");
        trailing.classList.add("mdc-notched-outline__trailing");
        element.append(leading, notch, trailing);
        return element;
    }
    createAnchor() {
        const element = document.createElement("div");
        element.classList.add("mdc-select__anchor");
        element.setAttribute("aria-labelledby", this.getLabelId()); // Outlined-select-label
        const notchedOutline = this.createNotchedOutline();
        const selectedTextContainer = this.createSelectedTextContainer();
        const iconContainer = document.createElement("span");
        iconContainer.classList.add("mdc-select__dropdown-icon");
        const dropdownIcon = new DropdownIcon().render();
        iconContainer.append(dropdownIcon);
        element.append(notchedOutline, selectedTextContainer, iconContainer);
        return element;
    }
    createMenu() {
        const menu = new SelectMenu(this.getLabel(), this.getItems());
        return menu.getMenuElement();
    }
    render() {
        const element = document.createElement("div");
        element.classList.add("mdc-select", "mdc-select--outlined");
        const anchor = this.createAnchor();
        const menu = this.createMenu();
        element.append(anchor, menu);
        this.material = new MDCSelect(element);
        return element;
    }

}