"use strict";

import {MDCList, MDCMenu, MDCRipple} from "./material/components.js";

export default class EnterprisePhoneListItem {
    static APIPrefix = "http://colectiva.com.ar:5050/enterprises/";
    static formatPhone(phone) {
        const digits = phone.replace(/\D/g, '');

        if (digits.length === 8) {
            return digits.replace(/(\d{4})(\d{4})/, '$1 $2');
        } else if (digits.length === 9) {
            return digits.replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3');
        } else if (digits.length === 10) {
            return digits.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2 $3');
        } else if (digits.length === 11 && (phone.startsWith('011') || phone.startsWith('015'))) {
            return digits.replace(/(\d{3})(\d{4})(\d{4})/, '($1) $2 $3');
        } else {
            return digits.replace(/(\d{4})(\d{3})(\d{4})/, '$1 $2 $3');
        }
    }
    constructor(phone, enterpriseId, isDeletable) {
        this.getPhone = () => phone;
        this.getEnterpriseId = () => enterpriseId;
        this.isDeletable = () => isDeletable;
    }
    async delete() {
        if(!confirm("¿Seguro de eliminar este número?")) return;
        const result = await fetch(EnterprisePhoneListItem.APIPrefix + this.getEnterpriseId() + "/phones", {
            method: "DELETE",
            headers: {
                'Content-Type': "application/json"
            },
            credentials: "include",
            body: JSON.stringify({
                phone: this.getPhone()
            })
        });
        if(result.status === 200) {
            console.log("Teléfono eliminado correctamente. ");
            this.getRootContainer().remove();
        } else {
            console.error("Error: " + result.status);
        }
    }
    render() {
        const li = document.createElement("li");
        li.classList.add("enterprise-phone-list__item");
        this.getRootContainer = () => li;
        const liContent = document.createElement("span");
        liContent.classList.add("enterprise-phone-list__item-content")
        liContent.innerText = EnterprisePhoneListItem.formatPhone(this.getPhone());
        const moreButtonContainer = document.createElement("div");
        //moreButtonContainer.id = "demo-menu";
        moreButtonContainer.classList.add("mdc-menu-surface--anchor");
        li.append(liContent, moreButtonContainer);

        const menuIconButton = document.createElement("button");
        menuIconButton.classList.add("mdc-icon-button");
        const menuIconButtonRipple = document.createElement("div");
        menuIconButtonRipple.classList.add("mdc-icon-button__ripple");
        const menuIconButtonFocusRing = document.createElement("span");
        menuIconButtonFocusRing.classList.add("mdc-icon-button__focus-ring");

        const moreButtonIcon = document.createElement("i");
        moreButtonIcon.classList.add("material-icons", "moreButtonIcon");
        //moreButtonIcon.id = "menu-button";
        moreButtonIcon.innerText = "more_vert";
        menuIconButton.append(menuIconButtonRipple, menuIconButtonFocusRing, moreButtonIcon);

        const menu = document.createElement("div");
        menu.classList.add("mdc-menu", "mdc-menu-surface");

        const menuList = document.createElement("ul");
        menuList.classList.add("mdc-deprecated-list");
        menuList.setAttribute("role", "menu");
        menuList.setAttribute("aria-hidden", "true");
        menuList.setAttribute("aria-orientation", "vertical");
        menuList.setAttribute("tabindex", "-1");

        const gItem = text => {
            const listItem = document.createElement("li");
            listItem.classList.add("mdc-deprecated-list-item");
            listItem.setAttribute("role", "menuitem");
            const ripple = document.createElement("span");
            ripple.classList.add("mdc-deprecated-list-item__ripple");
            const labelSpan = document.createElement("span");
            labelSpan.classList.add("mdc-deprecated-list-item__text");
            labelSpan.innerText = text;
            listItem.append(ripple, labelSpan);
            new MDCRipple(listItem);
            return listItem;
        }
        const callListItem = gItem("Llamar");
        const copyListItem = gItem("Copiar");
        const deleteListItem = gItem("Eliminar");
        menuList.append(callListItem, copyListItem)
        if(this.isDeletable()) menuList.append(deleteListItem);

        menu.appendChild(menuList);
        moreButtonContainer.append(menuIconButton, menu);

        const mdcMenu = new MDCMenu(menu);
        const mlist = new MDCList(menuList);
        mlist.listElements.map((listItemEl) => new MDCRipple(listItemEl));
        menuIconButton.addEventListener('click', e => {
            mdcMenu.open = !mdcMenu.open;
        });
        deleteListItem.addEventListener("click", async (e) => {
            await this.delete();
        });
        callListItem.addEventListener("click", e => {
            var numeroFormateado = encodeURIComponent(this.getPhone());
            window.open('tel://' + numeroFormateado);
        });
        copyListItem.addEventListener("click", e => {

            var elementoTemporal = document.createElement('textarea');
            elementoTemporal.value = this.getPhone();
            elementoTemporal.setAttribute('readonly', '');
            elementoTemporal.style.position = 'absolute';
            elementoTemporal.style.left = '-9999px';
            document.body.appendChild(elementoTemporal);

            elementoTemporal.select();
            document.execCommand('copy');

            document.body.removeChild(elementoTemporal);
        });

        return li;
    }
}