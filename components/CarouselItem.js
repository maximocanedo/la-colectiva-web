'use strict';
import IconButtonView from "./material/IconButtonView.js";
import * as auth from "./Auth.js";

export default class CarouselItem {

    constructor(data, actualUser, APIURL) {
        this.isModifiable = () => actualUser != null && actualUser.role >= auth.roles.MODERATOR;
        this.getAPIURL = () => APIURL;
        this.getData = () => data;
        this.getId = () => data._id;
        const item = document.createElement("div");
        this.getItem = () => item;
        this.loaded = false;
        this.setBlobImage = blob => {
            const urlContent = URL.createObjectURL(blob);
            item.style.backgroundImage = `url(${urlContent})`;
        };
        this.deleteEvent =  new CustomEvent('deleted', {
            detail: { id: this.getId() } // Puedes pasar datos adicionales si es necesario
        });
        console.log(this);
    }
    isActive() {
        return this.getItem().classList.contains("carousel--item-active");
    }
    async enable() {
        if(!this.loaded) await this.load();
        this.getItem().classList.add("carousel--item-active");
    }
    disable() {
        this.getItem().classList.remove("carousel--item-active");
    }
    async loadBlob() {
        const url = `http://colectiva.com.ar:5050/photos/${this.getId()}/view`;
        try {
            const respuesta = await fetch(url);
            if (respuesta.ok) {
                const blob = await respuesta.blob();
                return blob;
            } else {
                throw new Error('Error al descargar la imagen');
            }
        } catch (error) {
            console.error(error);
            return null;
        }
    }
    async load() {
        const blob = await this.loadBlob();
        this.loaded = true;
        this.setBlobImage(blob);
    }
    async delete() {
        if(!confirm("¿Seguro de eliminar esta foto?")) return;
        const result = await fetch(`${this.getAPIURL()}/photos/${this.getId()}`, {
            method: "DELETE",
            credentials: "include",
            headers: { 'Content-Type': "application/json" }
        });
        if(result.status === 200) {
            this.getItem().dispatchEvent(this.deleteEvent);
            this.getItem().remove();
            console.log("Eliminado. ");
        } else {
            console.error(result.status);
        }
    }
    addEventListener(event, handler, options) {
        this.getItem().addEventListener(event, handler, options);
    }
    render() {
        const header = document.createElement("div");
        const space = document.createElement("div");
        const caption = document.createElement("div");
        const deleteBtn = new IconButtonView("delete");

        this.getItem().classList.add("carousel--item");
        header.classList.add("carousel--item__header");
        if(this.isModifiable()) {
            header.append(deleteBtn.render());
            deleteBtn.addEventListener("click", async (e) => {
                await this.delete();
            });
        }
        space.classList.add("carousel--item__space");
        caption.classList.add("carousel--item__description", "mdc-typography--caption");

        caption.innerText = this.getData().description;

        this.getItem().append(header, space, caption);
        return this.getItem();
    }
}