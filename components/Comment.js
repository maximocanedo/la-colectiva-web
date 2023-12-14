"use strict";
import UnimplementedMethodException from "./exceptions/UnImplementedMethodException.js";
import * as auth from "./Auth.js";
import {MDCList, MDCMenu, MDCRipple} from "./material/components.js";

function formatoFecha(fecha) {
    const fechaIngresada = new Date(fecha);
    const fechaActual = new Date();
    const diferenciaMs = fechaActual - fechaIngresada;

    const segundos = Math.floor(diferenciaMs / 1000);
    const minutos = Math.floor(segundos / 60);
    const horas = Math.floor(minutos / 60);
    const dias = Math.floor(horas / 24);

    const resultado = (() => {
        if (segundos <= 2) {
            return { e: true, i: 1000, msg: "Ahora mismo" };
        } else if (segundos < 60) {
            return { e: true, i: 1000, msg: `Hace ${segundos} segundos` };
        } else if (minutos === 1) {
            return { e: true, i: 60 * 1000, msg: "Hace un minuto. " };
        } else if (minutos < 60) {
            return { e: true, i: 60 * 1000, msg: `Hace ${minutos} minutos` };
        } else if (horas === 1) {
            return { e: true, i: 60 * 60 * 1000, msg: "Hace una hora. " };
        } else if (horas < 24 && fechaIngresada.getDate() === fechaActual.getDate()) {
            return {
                e: false,
                i: -1,
                msg: `${('0' + fechaIngresada.getHours()).slice(-2)}:${('0' + fechaIngresada.getMinutes()).slice(-2)}`,
            };
        } else if (dias === 1 && fechaIngresada.getDate() !== fechaActual.getDate()) {
            return {
                e: false,
                i: -1,fechaIngresada, fechaActual,
                msg: `Ayer a las ${('0' + fechaIngresada.getHours()).slice(-2)}:${('0' + fechaIngresada.getMinutes()).slice(-2)}`,
            };
        } else if (dias < 7 && fechaIngresada.getMonth() === fechaActual.getMonth()) {
            const diasSemana = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
            const diaSemana = diasSemana[fechaIngresada.getDay()];
            return {
                e: false,
                i: -1,fechaIngresada, fechaActual,
                msg: `${diaSemana} a las ${('0' + fechaIngresada.getHours()).slice(-2)}:${('0' + fechaIngresada.getMinutes()).slice(-2)}`,
            };
        } else if (fechaIngresada.getFullYear() === fechaActual.getFullYear()) {
            if (fechaIngresada.getMonth() === fechaActual.getMonth()) {
                return {
                    e: false,
                    i: -1,fechaIngresada, fechaActual,
                    msg: `El ${fechaIngresada.getDate()} de ${meses[fechaIngresada.getMonth()]}`,
                };
            } else {
                return { e: false, i: -1, fechaIngresada, fechaActual, msg: `${fechaIngresada.getDate()}/${fechaIngresada.getMonth() + 1}` };
            }
        } else {
            return {
                e: false,
                i: -1,fechaIngresada, fechaActual,
                msg: `${fechaIngresada.getDate()}/${fechaIngresada.getMonth() + 1}/${fechaIngresada.getFullYear()}`,
            };
        }
    })();

    return resultado;
}


export default class Comment {
    constructor(data, loggedUser) {
        let content = data.content ?? "";
        let user = data.user?? { _id: "", name: "Usuario"};
        this.isModifiable = () => loggedUser != null && loggedUser._id === data.user._id;
        this.isDeletable = () => this.isModifiable() || loggedUser != null && loggedUser.role >= auth.roles.MODERATOR;
        let _id = data._id ?? "";
        let uploadDate = data.uploadDate?? new Date().toISOString();
        uploadDate = new Date(uploadDate);
        let active = data.active ?? false;
        this.getContent = () => content;
        this.getUser = () => user;
        this.getId = () => _id;
        this.getUploadDate = () => uploadDate;
        this.isActive = () => active;
        this.getVersion = () => data.__v;
        this.isEdited = () => this.getVersion() > 0;
    }
    async delete() {
        if(!confirm("¿Seguro de eliminar este comentario?")) return;
        const result = await fetch(`https://colectiva.com.ar:5050/comments/${this.getId()}`, {
            method: "DELETE",
            credentials: 'include',
        });
        if(result.status === 200) {
            console.log("Comment deleted. ");
            this.getContainer().remove();
        } else {
            console.log("No se eliminó el comentario. ");
        }

    }
    uploadMeta(data = null) {
        const updateElapsedTime = () => {
            let r = formatoFecha(this.getUploadDate().toLocaleString());
            let { e, i, msg } = r;
            this.getUploadTag().innerText = "@" + this.getUser().username + " · " + msg;
            if(this.isEdited()) this.getUploadTag().innerText += " (Editado)";
            let o = formatoFecha(this.getUploadDate());
            if (e) {
                setTimeout(() => {
                    updateElapsedTime(); // Llama recursivamente para actualizar el tiempo
                }, i);
            }
        };

        updateElapsedTime(); // Llama por primera vez para comenzar la actualización periódica
    }

    async edit() {
        let newValue = this.getNewContent();
        const result = await fetch(`https://colectiva.com.ar:5050/comments/${this.getId()}`, {
           method: 'PUT',
            credentials: 'include',
            headers: {
               'Content-Type': "application/json"
            },
           body: JSON.stringify({content: newValue})
        });
        if(result.status === 200 || result.status === 201) {
            console.log("Comentario editado correctamente. ");
            const data = await result.json();
            this.getVersion = () => data.__v;
            this.getContent = () => data.content;
            this.setContent(data.content);
            this.uploadMeta(data);

        } else {
            console.log("El comentario no se editó. ");
        }
    }

    render() {
        const container = document.createElement("div");
        container.classList.add("comment");
        this.getContainer = () => container;

        const header = document.createElement("div");
        header.classList.add("comment-header");

        const userTag = document.createElement("a");
        userTag.classList.add("comment-user-name");
        userTag.href = "#" + this.getUser()._id;
        userTag.innerText = this.getUser().name;

        const uploadTag = document.createElement("span");
        uploadTag.classList.add("comment-meta");
        //uploadTag.innerText = ` @${this.getUser().username} · ${formatoFecha(this.getUploadDate().toLocaleString())}`;
        this.getUploadTag = () => uploadTag;
        this.uploadMeta();
        const space = document.createElement("div");
        space.classList.add("space");

        const moreButtonContainer = document.createElement("div");
        //moreButtonContainer.id = "demo-menu";
        moreButtonContainer.classList.add("mdc-menu-surface--anchor");

        const moreButtonIcon = document.createElement("i");
        moreButtonIcon.classList.add("material-icons", "moreButtonIcon");
        //moreButtonIcon.id = "menu-button";
        moreButtonIcon.innerText = "more_vert";

        const menu = document.createElement("div");
        menu.classList.add("mdc-menu", "mdc-menu-surface");

        const menuList = document.createElement("ul");
        menuList.classList.add("mdc-deprecated-list");
        menuList.setAttribute("role", "menu");
        menuList.setAttribute("aria-hidden", "true");
        menuList.setAttribute("aria-orientation", "vertical");
        menuList.setAttribute("tabindex", "-1");

        const editListItem = document.createElement("li");
        editListItem.classList.add("mdc-deprecated-list-item");
        editListItem.setAttribute("role", "menuitem");
        const r1 = document.createElement("span");
        r1.classList.add("mdc-deprecated-list-item__ripple");
        const editSpan = document.createElement("span");
        editSpan.classList.add("mdc-deprecated-list-item__text");
        editSpan.innerText = "Editar";
        editListItem.append(r1, editSpan);

        const deleteListItem = document.createElement("li");
        deleteListItem.classList.add("mdc-deprecated-list-item");
        deleteListItem.setAttribute("role", "menuitem");
        const r2 = document.createElement("span");
        r2.classList.add("mdc-deprecated-list-item__ripple");
        const deleteSpan = document.createElement("span");
        deleteSpan.classList.add("mdc-deprecated-list-item__text");
        deleteSpan.innerText = "Eliminar";
        deleteListItem.append(r2, deleteSpan);

        if(this.isModifiable()) menuList.append(editListItem);
        if(this.isDeletable()) menuList.append(deleteListItem);

        menu.appendChild(menuList);
        moreButtonContainer.append(moreButtonIcon, menu);

        const mdcMenu = new MDCMenu(menu);
        new MDCRipple(editListItem);
        new MDCRipple(deleteListItem);
        const mlist = new MDCList(menuList);
        const listItemRipples = mlist.listElements.map((listItemEl) => new MDCRipple(listItemEl));
        moreButtonIcon.addEventListener('click', e => {
            mdcMenu.open = !mdcMenu.open;
        })

        const content = document.createElement("p");
        content.classList.add("comment-content");
        content.innerText = this.getContent();
        this.setContent = c => content.innerText = c;

        const label = document.createElement("label");
        label.classList.add("txtComentario", "mdc-text-field", "mdc-text-field--filled", "mdc-text-field--textarea", "mdc-text-field--no-label");

        const textFieldRipple = document.createElement("span");
        textFieldRipple.classList.add("mdc-text-field__ripple");

        const textFieldResizer = document.createElement("span");
        textFieldResizer.classList.add("mdc-text-field__resizer");

        const textArea = document.createElement("textarea");
        textArea.placeholder = "Editá tu comentario.";
        textArea.classList.add("mdc-text-field__input", "txtComentario");
        textArea.rows = "1";
        textArea.cols = "40";
        textArea.value = this.getContent();
        textArea.setAttribute("aria-label", "Label");
        this.getNewContent = () => textArea.value;

        const lineRipple = document.createElement("span");
        lineRipple.classList.add("mdc-line-ripple");

        textFieldResizer.appendChild(textArea);
        label.append(textFieldRipple, textFieldResizer, lineRipple);

        const publishButton = document.createElement("button");
        publishButton.classList.add("mdc-button");

        const buttonRipple = document.createElement("span");
        buttonRipple.classList.add("mdc-button__ripple");

        const buttonFocusRing = document.createElement("span");
        buttonFocusRing.classList.add("mdc-button__focus-ring");

        const buttonLabel = document.createElement("span");
        buttonLabel.classList.add("mdc-button__label");
        buttonLabel.innerText = "Editar";


        const cancelEditButton = document.createElement("button");
        cancelEditButton.classList.add("mdc-button");

        const buttonRipple2 = document.createElement("span");
        buttonRipple2.classList.add("mdc-button__ripple");

        const buttonFocusRing2 = document.createElement("span");
        buttonFocusRing2.classList.add("mdc-button__focus-ring");

        const buttonLabel2 = document.createElement("span");
        buttonLabel2.classList.add("mdc-button__label");
        buttonLabel2.innerText = "Cancelar";

        publishButton.append(buttonRipple, buttonFocusRing, buttonLabel);
        cancelEditButton.append(buttonRipple2, buttonFocusRing2, buttonLabel2);

        publishButton.addEventListener("click", async (e) => {
            await this.edit();
        });
        cancelEditButton.addEventListener("click", async (e) => {
            this.setEditState(false);
        });

        this.setEditState = b => {
            if(b) {
                content.innerHTML = "";
                content.append(label, publishButton, cancelEditButton);
            } else {
                content.innerHTML = '';
                content.innerText = this.getContent();
            }
        }


        editListItem.addEventListener("click", async (e) => {
            this.setEditState(true);
        });
        deleteListItem.addEventListener("click", async (e) => {
            await this.delete();
        });








        header.append(userTag, uploadTag, space, (
        (this.isModifiable() || this.isDeletable()) ? moreButtonContainer : "" ));
        container.append(header, content);

        return container;
    }

}