"use strict";
import CommentContainer from "./CommentContainer.js";
import VoteManager from "./VoteManager.js";
import EnterprisePhoneList from "./EnterprisePhoneList.js";
import * as auth from "./Auth.js";
import TextField from "./material/TextField.js";
import ButtonView from "./material/ButtonView.js";

export default class EnterprisePage {
    constructor(data, error = null, APIURL = "", user = null) {
        this.getData = () => data;
        this.getId = () => data._id?? "";
        this.getError = () => error;
        this.getAPIURL = () => APIURL;
        this.getActualUser = () => user;
        this.isModifiable = () => user != null && user.role >= auth.roles.ADMIN;
    }
    static formatCUIT(raw) {
        raw += "";
        let prefix = raw.substring(0, 2);
        let suffix = raw.substring(raw.length - 1, raw.length);
        let cuitBody = raw.substring(2, raw.length-1);
        cuitBody = cuitBody.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        return `${prefix}-${cuitBody}-${suffix}`;
    }
    static async load(id) {
        const APIURL = `http://colectiva.com.ar:5050/enterprises/${id}`;
        this.getAPIURL = () => APIURL;
        const user = await auth.getActualUser();
        const source = await fetch(this.getAPIURL(), {
            method: "GET",
            credentials: 'include',
            headers: {
                'Content-Type': "application/json"
            }
        });
        let ep = new EnterprisePage({}, "Error. " + source.status + ". ", APIURL, user);
        if(source.status === 200) {
            const data = await source.json();
            const el = new EnterprisePage(data, null, APIURL, user);
            await el.initAsyncData();
            return el;
        } else return ep;
    }
    async renderComments() {
        if(this.getId() === null) return;
        const commentContainer = await CommentContainer.load(this.getAPIURL());
        return commentContainer;
    }
    async renderVotes() {
        if(this.getId() === null) return;
        const votesManager = await VoteManager.load(this.getAPIURL());
        return votesManager;
    }
    async initAsyncData() {
        try {
            const [comments, votes] = await Promise.all([
                this.renderComments(),
                this.renderVotes()
            ]);

            this.commentsSection = comments;
            this.votesSection = votes;
        } catch (error) {
            console.error("Error occurred while fetching comments or votes:", error);
        }
    }

    render() {
        const data = this.getData();
        const container = document.createElement("div");
        container.classList.add("enterprise-page");

        if(this.getError() !== null) {
            container.innerText = this.getError();
            return container;
        }

        const title = document.createElement("h1");
        title.classList.add("__viewable");
        const cuit = document.createElement("h3");
        cuit.classList.add("__viewable");
        const descr = document.createElement("p");
        descr.classList.add("__viewable");
        const ff = document.createElement("span");
        ff.classList.add("__viewable");

        const titleEditable = new TextField({ variant: "filled", type: "text", label: "Nombre de la empresa" });
        titleEditable.getElement().classList.add("__editable");
        const cuitEditable = new TextField({ variant: "filled", type: "text", label: "Número de C.U.I.T." });
        cuitEditable.getElement().classList.add("__editable");
        const descriptionEditable = new TextField({ variant: "filled", type: "text", label: "Descripción" });
        descriptionEditable.getElement().classList.add("__editable");
        const ffEditable = new TextField({ variant: "filled", type: "date", label: "Fecha de fundación" });
        ffEditable.getElement().classList.add("__editable");

        this.goEditable = () => {
            const data = this.getData();
            titleEditable.setValue(data.name);
            cuitEditable.setValue(data.cuit);
            descriptionEditable.setValue(data.description);
            ffEditable.setValue(new Date(data.foundationDate).toISOString().slice(0, 10));
            container.querySelectorAll(".__viewable").forEach(e => e.style.display = "none");
            container.querySelectorAll(".__editable").forEach(e => e.style.display = "block");
        };
        this.goNormal = () => {
            const data = this.getData();
            title.innerText = data.name;
            cuit.innerText = "CUIT No. " + EnterprisePage.formatCUIT(data.cuit);
            descr.innerText = data.description;
            ff.innerText = "Fecha de fundación: " + new Date(data.foundationDate).toLocaleDateString();
            container.querySelectorAll(".__viewable").forEach(e => e.style.display = "block");
            container.querySelectorAll(".__editable").forEach(e => e.style.display = "none");
        };

        const btnEditar = new ButtonView("Editar", {raised: true, iconLeading: "edit"});
        const btnOK = new ButtonView("Guardar", {raised: true});
        const btnCancelarEdicion = new ButtonView("Cancelar");

        const btnEditarView = btnEditar.getElement();
        btnEditarView.classList.add("__viewable");
        const btnOKView = btnOK.getElement();
        btnOKView.classList.add("__editable");
        const btnCancelarEdicionView = btnCancelarEdicion.getElement();
        btnCancelarEdicionView.classList.add("__editable");

        btnEditarView.addEventListener("click", e =>{
            this.goEditable();
        });
        btnOKView.addEventListener("click", async (e) => {
            let data = {
                name: titleEditable.getValue(),
                cuit: cuitEditable.getValue(),
                description: descriptionEditable.getValue(),
                foundationDate: new Date(ffEditable.getValue()).toISOString()
            };
            await this.edit(data);
        });
        btnCancelarEdicionView.addEventListener("click", e => {
            this.goNormal();
        });




        const listTitle = document.createElement("span");
        listTitle.innerText = "\n\nTeléfonos: ";
        const list = new EnterprisePhoneList(data.phones, this.getId(), this.getActualUser());

        container.append(
            title, titleEditable.getElement(),
            cuit, cuitEditable.getElement(),
            descr, descriptionEditable.getElement(),
            ff, ffEditable.getElement(),
            ...(this.isModifiable() ? [btnEditarView, btnOKView, btnCancelarEdicionView] : []),
            listTitle, list.render()
        );
        this.goNormal();

        if(this.votesSection != null) container.append(this.votesSection.render());
        if(this.commentsSection != null) container.append(this.commentsSection.render());

        return container;
    }
    async updateData() {
        const result = await fetch(this.getAPIURL(), {
            method: "GET",
            credentials: 'include',
            headers: {
                'Content-Type': "application/json"
            }
        });

        if (result.status === 200) {
            const data = await result.json();
            this.getData = () => data;
            this.goNormal();
        } else {
            console.error("Error fetching updated data:", result.status);
        }
    }

// Modifica tu función edit para llamar al método de actualización después de editar los datos
    async edit(data) {
        if (!confirm("¿Seguro de editar este registro?")) return;
        try {
            const result = await fetch(this.getAPIURL(), {
                method: "PATCH",
                headers: {
                    'Content-Type': "application/json"
                },
                credentials: "include",
                body: JSON.stringify(data)
            });

            if (result.status === 200 || result.status === 201) {
                console.log("Se editó completamente. ");
                await this.updateData();
            } else {
                console.error("Error " + result.status);
            }
        } catch (error) {
            console.error("Error occurred while editing data:", error);
        }
    }
}