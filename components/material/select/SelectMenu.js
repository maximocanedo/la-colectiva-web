'use strict';
export default class SelectMenu {
    static ListItem = class {
        constructor(text = "", value = "", selected = false) {
            this.selected = selected;
            this.value = value;
            this.text = text;
            this.element = this.createListItemElement();
        }

        createListItemElement() {
            const li = document.createElement("li");
            li.classList.add("mdc-deprecated-list-item");
            li.setAttribute("role", "option");
            li.setAttribute("aria-selected", this.selected);

            if (this.selected) {
                li.classList.add("mdc-deprecated-list-item--selected");
            }

            const rippleSpan = document.createElement("span");
            rippleSpan.classList.add("mdc-deprecated-list-item__ripple");
            li.appendChild(rippleSpan);

            if (this.text !== "") {
                const textSpan = document.createElement("span");
                textSpan.classList.add("mdc-deprecated-list-item__text");
                textSpan.textContent = this.text;
                li.appendChild(textSpan);
            }

            li.dataset.value = this.value;

            return li;
        }

        getElement() {
            return this.element;
        }

        static createSelectedListItem() {
            const li = document.createElement("li");
            li.classList.add("mdc-deprecated-list-item", "mdc-deprecated-list-item--selected");
            li.setAttribute("role", "option");
            li.setAttribute("aria-selected", true);

            const rippleSpan = document.createElement("span");
            rippleSpan.classList.add("mdc-deprecated-list-item__ripple");
            li.appendChild(rippleSpan);

            return li;
        }
    }

    constructor(label, items = []) {
        this.menu = this.createMenu(label);
        items.map(item => {
            const listItem = new SelectMenu.ListItem(item.text, item.value, item.selected?? false);
            this.addListItem(listItem);
        });
    }

    createMenu(label) {
        const div = document.createElement("div");
        div.classList.add(
            "mdc-select__menu",
            "mdc-menu",
            "mdc-menu-surface",
            "mdc-menu-surface--fullwidth"
        );

        const ul = document.createElement("ul");
        ul.classList.add("mdc-deprecated-list");
        ul.setAttribute("role", "listbox");
        ul.setAttribute("aria-label", label);

        div.appendChild(ul);

        return div;
    }

    getMenuElement() {
        return this.menu;
    }

    addListItem(listItem) {
        const ul = this.menu.querySelector("ul");
        if (ul) {
            ul.appendChild(listItem.getElement());
        }
    }
}