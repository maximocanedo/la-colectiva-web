'use strict';
import Comment from './Comment.js';
import * as auth from './Auth.js';
import {MDCRipple, MDCTextField} from "./material/components.js";
export default class CommentContainer {
    static loggedUser = null;
    static getRandomId(prefix = "") {
        let str = prefix + "__"
        str += (Math.random() + 1).toString(36).substring(2);
        let ln = (document.querySelectorAll(`#${str}`).length);
        str += ln === 0 ? "" : ln;
        return str.replaceAll(".", "_");
    }
    constructor(arr, err = null, apiURL = "") {
        // Asumimos que se trata de un array de Comments.
        let rawComments = [...arr];
        let comments = rawComments.map(comment => new Comment(comment, CommentContainer.loggedUser));
        this.getError = () => err;
        this.getComments = () => comments;
        this.getAPIURL = () => apiURL;
        this.length = this.getComments().length;
        const DOMId = CommentContainer.getRandomId("CommentContainer");
        this.getDOMId = () => DOMId;
        this.adapter();
    }
    async reload() {
        CommentContainer.loggedUser = await auth.getActualUser();
        const commentsSource = await fetch(
            this.getAPIURL(), {
                method: 'GET',
                credentials: 'include',
            }
        );
        if(commentsSource.status === 200) {
            const data = await commentsSource.json();
            const arr = data.comments.map(comment => new Comment(comment, CommentContainer.loggedUser));
            this.fill(arr);
        } else {
            this.showError("Error HTTP " + commentsSource.status + ". ");
        }
    }
    static async load(apiURL) {
        CommentContainer.loggedUser = await auth.getActualUser();
        apiURL = `${apiURL}/comments`;
        const commentsSource = await fetch(
            apiURL, {
                method: 'GET',
                credentials: 'include',
            }
        );
        let cc = null;
        if(commentsSource.status === 200) {
            const data = await commentsSource.json();
            const arr = data.comments;
            cc = new CommentContainer(arr, null, apiURL);
        } else {
            cc = new CommentContainer([], "Error HTTP " + commentsSource.status + ". ", apiURL);
        }
        return cc;
    }
    __header__ToggleButton() {
        const toggleBtn = document.createElement("a");
        toggleBtn.classList.add("material-icons");
        this.getToggleBtn = () => toggleBtn;
        toggleBtn.innerText = "expand_less";
        return toggleBtn;
    }
    __header__Label() {
        const headerLabel = document.createElement("span");
        headerLabel.innerText = "Comentarios · " + this.length;
        this.setHeaderLabelText = text => headerLabel.innerText = text;
        return headerLabel;
    }
    __header() {
        const header = document.createElement("div");
        header.classList.add("comments-container--header", "mdc-ripple-surface");
        this.getHeader = () => header;
        const toggleBtn = this.__header__ToggleButton();
        const headerLabel = this.__header__Label();
        header.append(headerLabel, this.__space(), toggleBtn);
        MDCRipple.attachTo(header);
        return header;
    }
    __space() {
        const space = document.createElement("div");
        space.classList.add("space");
        return space;
    }
    __txtComment() {
        const label = document.createElement("label");
        label.classList.add("txtComentario", "mdc-text-field", "mdc-text-field--filled", "mdc-text-field--textarea", "mdc-text-field--no-label");

        const textFieldRipple = document.createElement("span");
        textFieldRipple.classList.add("mdc-text-field__ripple");

        const textFieldResizer = document.createElement("span");
        textFieldResizer.classList.add("mdc-text-field__resizer");

        const textArea = document.createElement("textarea");
        textArea.placeholder = "Escribí un comentario.";
        textArea.classList.add("mdc-text-field__input");
        textArea.rows = "1";
        textArea.cols = "40";
        textArea.id = this.getDOMId() + "__textarea";
        textArea.setAttribute("aria-label", "Label");
        this.getTextareaValue = () => textArea.value;
        this.setTextareaValue = v => textArea.value = v;

        const lineRipple = document.createElement("span");
        lineRipple.classList.add("mdc-line-ripple");

        textFieldResizer.appendChild(textArea);
        label.append(textFieldRipple, textFieldResizer, lineRipple);
        new MDCTextField(label);
        return label;
    }
    __publishBtn() {
        const publishButton = document.createElement("button");
        publishButton.classList.add("mdc-button");

        const buttonRipple = document.createElement("span");
        buttonRipple.classList.add("mdc-button__ripple");

        const buttonFocusRing = document.createElement("span");
        buttonFocusRing.classList.add("mdc-button__focus-ring");

        const buttonLabel = document.createElement("span");
        buttonLabel.classList.add("mdc-button__label");
        buttonLabel.innerText = "Publicar";

        publishButton.append(buttonRipple, buttonFocusRing, buttonLabel);
        new MDCRipple(publishButton);
        return publishButton;
    }
    adapter() {
        let hidden = false;
        const root = document.createElement("div");
        root.classList.add("comments-container");

        const header = this.__header();

        const container = document.createElement("div");
        container.classList.add("comments-container--body");
        this.getContainer = () => container;

        this.clear = () => {
            container.innerHTML = "";
            this.setHeaderLabelText("Comentarios");
        };
        this.fill = comments => {
            this.clear();
            comments.map(comment => container.append(comment.render()));
            this.setHeaderLabelText("Comentarios · " + comments.length);
        };
        this.showError = (err) => {
            container.innerText = "Error al obtener los comentarios. \nDetalles: " + err;
        }

        if(this.getError() === null) {
            let comments = this.getComments();
            this.fill(comments);
        } else {
            this.showError(this.getError());
        }

        // TODO Validar acá que el usuario pueda publicar comentarios antes de continuar.
        const footer = document.createElement("footer");
        footer.classList.add("comments-container--footer");

        const txtComment = this.__txtComment();
        const publishButton = this.__publishBtn();

        if(CommentContainer.loggedUser != null) {
            if(CommentContainer.loggedUser.role === auth.roles.LIMITED)
                footer.innerText = "Estás inhabilitado para publicar comentarios. ";
            else footer.append(txtComment, publishButton);
        } else footer.innerText = "Iniciá sesión para comentar. ";

        root.append(header, container, footer);

        this.collapse = () => {
            hidden = true;
            this.getContainer().style.display = "none";
            footer.style.display = "none";
            this.getToggleBtn().innerText = "expand_more";
        };
        this.expand = () => {
            hidden = false;
            this.getContainer().style.display = "block";
            footer.style.display = "flex";
            this.getToggleBtn().innerText = "expand_less";
        };



        header.addEventListener('click', e => {
            if(hidden) this.expand();
            else this.collapse();
        });
        publishButton.addEventListener('click', async () => {
            const text = this.getTextareaValue();
            const action = await fetch(
                this.getAPIURL(), {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        'Content-Type': "application/json"
                    },
                    body: JSON.stringify({content: text})
                }
            );
            if(action.status === 200 || action.status === 201) {
                await this.reload();
                this.setTextareaValue("");
            } else {
                console.error("Couldn't post your comment. ");
            }
        });


        this.render = () => root;
    }

}