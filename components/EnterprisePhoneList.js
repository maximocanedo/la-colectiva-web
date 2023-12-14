"use strict";

import {MDCList, MDCMenu, MDCRipple} from "./material/components.js";
import EnterprisePhoneListItem from "./EnterprisePhoneListItem.js";
import * as auth from "./Auth.js";
import ButtonView from "./material/ButtonView.js";

export default class EnterprisePhoneList {
    static APIPrefix = "https://colectiva.com.ar:5050/enterprises/";
    constructor(data, enterpriseId, actualUser) {
        this.getData = () => data;
        this.getEnterpriseId = () => enterpriseId;
        this.isDeletable = () => actualUser != null && actualUser.role >= auth.roles.MODERATOR;
    }
    async reload() {
        const result = await fetch(EnterprisePhoneList.APIPrefix + this.getEnterpriseId() + "/phones", {
            headers: {
                'Content-Type': "application/json"
            },
            credentials: "include",
            method: "GET"
        });
        if(result.status === 200) {
            const data = await result.json();
            this.getData = () => data.phones;
            this.fill(data.phones);
        }
    }
    async add(text) {
        const phone = text.replace(/\D/g, '');
        const result = await fetch(EnterprisePhoneList.APIPrefix + this.getEnterpriseId() + "/phones", {
            headers: {
                'Content-Type': "application/json"
            },
            credentials: "include",
            method: "POST",
            body: JSON.stringify({phone})
        });
        if(result.status === 200 || result.status === 201) {
            console.log("OK");
            await this.reload();
        } else {
            console.error("Error " + result.status);
        }
    }
    render() {
        const container = document.createElement("div");
        container.classList.add("enterprise-phone-list");
        const list = document.createElement("ul");
        list.classList.add("enterprise-phone-list__ul");
        this.getList = () => list;
        this.clear = () => list.innerHTML = "";
        this.fill = arr => {
            this.clear();
            arr.map(phone => {
                const li = new EnterprisePhoneListItem(phone, this.getEnterpriseId(), this.isDeletable());

                list.append(li.render());
            });
        }
        const data = this.getData();
        this.fill(data);
        const addButton = new ButtonView("Agregar", {outlined: true, iconLeading: "add"});
        addButton.getElement().addEventListener("click", async (e) => {
            await this.add(prompt("Ingresá un número de teléfono: "));
        });
        container.append(list);
        if(this.isDeletable()) container.append(addButton.getElement());


        return container;
    }
}