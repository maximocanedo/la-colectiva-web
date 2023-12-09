"use strict";
import {MDCList} from "../material/components.js";
import FullscreenDialog from "../material/dialog/FullscreenDialog.js";
import TextField from "../material/TextField.js";

export default class DockSelect {
    static getRandomId(prefix = "") {
        let str = prefix + "__"
        str += (Math.random() + 1).toString(36).substring(2);
        let ln = (document.querySelectorAll(`#${str}`).length);
        str += ln === 0 ? "" : ln;
        return str.replaceAll(".", "_");
    }
    static ListItem = class {
        constructor(primaryText, secondaryText, id, group, value) {
            this.primaryText = primaryText;
            this.secondaryText = secondaryText;
            this.id = id;
            this.group = group;
            this.value = value;
        }

        render() {
            const listItem = document.createElement('li');
            listItem.classList.add('mdc-deprecated-list-item');
            listItem.setAttribute('role', 'radio');
            listItem.setAttribute('aria-checked', 'false');

            const rippleSpan = document.createElement('span');
            rippleSpan.classList.add('mdc-deprecated-list-item__ripple');
            listItem.appendChild(rippleSpan);

            const graphicSpan = document.createElement('span');
            graphicSpan.classList.add('mdc-deprecated-list-item__graphic');

            const radioDiv = document.createElement('div');
            radioDiv.classList.add('mdc-radio');

            const input = document.createElement('input');
            input.classList.add('mdc-radio__native-control');
            input.setAttribute('type', 'radio');
            input.setAttribute('id', this.id);
            input.setAttribute('name', this.group);
            input.setAttribute('value', this.value);
            radioDiv.appendChild(input);

            const radioBackground = document.createElement('div');
            radioBackground.classList.add('mdc-radio__background');

            const outerCircle = document.createElement('div');
            outerCircle.classList.add('mdc-radio__outer-circle');
            radioBackground.appendChild(outerCircle);

            const innerCircle = document.createElement('div');
            innerCircle.classList.add('mdc-radio__inner-circle');
            radioBackground.appendChild(innerCircle);

            radioDiv.appendChild(radioBackground);
            graphicSpan.appendChild(radioDiv);
            listItem.appendChild(graphicSpan);

            const label = document.createElement('label');
            label.classList.add('mdc-deprecated-list-item__text');
            label.setAttribute('for', this.id);

            const primarySpan = document.createElement('span');
            primarySpan.classList.add('mdc-deprecated-list-item__primary-text');
            primarySpan.textContent = this.primaryText;
            label.appendChild(primarySpan);

            const secondarySpan = document.createElement('span');
            secondarySpan.classList.add('mdc-deprecated-list-item__secondary-text');
            secondarySpan.textContent = this.secondaryText;
            label.appendChild(secondarySpan);

            listItem.appendChild(label);

            return listItem;
        }
    }
    constructor() {
        const id = DockSelect.getRandomId("DockSelect");
        this.getId = () => id;
        this.docks = [];
        this.page = 0;
        this.items = 8;
        this.q = "";
        this.initialLoad = 7;
        const list = this.renderList();
        const materialList = new MDCList(list);
        this.getListElement = () => list;
        this.getMaterialListElement = () => materialList;

        const txt = new TextField({variant: "outlined", label: "Muelle", icon: "place", type: "text"});
        this.getTextField = () => txt;
    }
    getSelectedId() {
        if(document.querySelector('input[name="' + this.getId() + '"]:checked') == null) return null;
        return document.querySelector('input[name="' + this.getId() + '"]:checked').value;
    }
    getDockListItems(arr) {
        const docks = [];
        arr.map(dock => {
            const listItem = new DockSelect.ListItem(dock.name, dock.region.name, dock._id, this.getId(), dock._id);
            docks.push(listItem);
        });
        return docks;
    }
    addItems(arr) {
        const docks = this.getDockListItems(arr);
        docks.map(dock => {
            const item = dock.render();
            this.getListElement().append(item);
            item.addEventListener("click", e => {
               this.getTextField().setValue(this.getMaterialListElement().getPrimaryText(item));
            });
        });
        this.getMaterialListElement().layout();
    }
    async more() {
        this.page++;
        const page = this.page
        const source = await fetch("http://colectiva.com.ar:5050/docks/?q="+this.q+"&prefer=-1&itemsPerPage="+this.items+"&p="+page, {
            method: "GET",
            credentials: "include"
        });
        if(source.ok) {
            const data = await source.json();
            this.docks = [ ...this.docks, ...data ];
            this.addItems(data);
        }
    }
    async search() {
        const page = this.page;
        const source = await fetch("http://colectiva.com.ar:5050/docks/?q="+this.q+"&prefer=-1&itemsPerPage="+this.items+"&p="+page, {
            method: "GET",
            credentials: "include"
        });
        if(source.ok) {
            const list = this.getListElement();
            const data = await source.json();
            this.docks = [ ...data ];
            list.innerHTML = "";
            this.addItems(data);
        }

    }
    async init() {
        await this.search();
        const list = this.getListElement();
    }
    getDocks() {
        return this.docks;
    }
    renderList() {
        // <ul class="mdc-deprecated-list mdc-deprecated-list--two-line" id="my-list" role="radiogroup">
        const element = document.createElement("ul");
        element.classList.add("mdc-deprecated-list", "mdc-deprecated-list--two-line");
        element.setAttribute("role", "radiogroup");
        return element;
    }
    renderDialog() {
        const dialog = new FullscreenDialog("Seleccionar muelle", null, {closeButton: false});
        const md = dialog.init();
        const txt = new TextField({variant: "outlined", icon: "search", label: "", type: "search", placeholder: "Buscar muelles"});
        dialog.getHeader().append(txt.getElement());
        txt.addEventListener("input", async (e) => {
            this.q = e.target.value;
            await this.search();
        });
        const more = async () => await this.more();
        const content = dialog.getContent();
        content.addEventListener('scroll', async function(e) {
            //console.log(e);
            if (content.scrollTop + content.clientHeight >= content.scrollHeight) {
                await more();
            }
            if (content.scrollHeight <= content.clientHeight + content.scrollTop) {
                // Si el contenido no llena el contenedor, carga más elementos
                await more();

                // Verifica nuevamente después de cargar más elementos
                if (content.scrollHeight <= content.clientHeight + content.scrollTop) {
                    // Si aún no se ha llenado el contenedor, puedes cargar más elementos si es necesario
                    await more();
                }
            }
        });
        md.root.classList.add("dock-select--dialog");
        return {dialog, md};
    }
    render() {
        const txt = this.getTextField();
        const el = txt.getElement();
        txt.getElement().querySelector("input").setAttribute("readonly", "true");
        const list = this.getListElement();
        const dialog = this.renderDialog();
        dialog.dialog.insertInContent(list);
        el.addEventListener("click", e => {
            dialog.md.open();
        });
        return txt.getElement();
    }
}