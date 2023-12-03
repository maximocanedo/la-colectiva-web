'use strict';
import IconButtonView from "./material/IconButtonView.js";
import CarouselItem from "./CarouselItem.js";
import * as auth from "./Auth.js";

export default class Carousel {
    constructor(APIURL, user) {
        this.getActualUser = () => user;
        this.isModifiable = () => user != null && user.role >= auth.roles.MODERATOR;
        this.getAPIURL = () => APIURL;
        this.getData = () => ([]);
        let images = [];
        this.getImages = () => images;
        this.index = 0;
        this.pushImage = image => images.push(image);
        this.clearImages = () => images = [];
        const leftButton = new IconButtonView("chevron_left");
        this.getPrevButton = () => leftButton;
        const rightButton = new IconButtonView("chevron_right");
        this.getNextButton = () => rightButton;
    }
    async reload() {
        const url = this.getAPIURL() + "/photos/";
        const source = await fetch(url, {
            method: "GET",
            credentials: "include",
            headers: {
                'Content-Type': "application/json"
            }
        });
        if(source.status === 200) {
            const { pictures } = await source.json();
            this.getData = () => pictures;
        } else {
            console.error(source.status);
        }
    }
    static async load(APIURL) {
        const user = await auth.getActualUser();
        const el = new Carousel(APIURL, user);
        await el.reload();
        return el;
    }

    render() {
        const carousel = document.createElement("div");
        carousel.classList.add("carousel");


        const content = document.createElement("div");
        this.getContent = () => content;
        content.classList.add("carousel-content");
        this.renderContent();

        const leftButtonContainer = document.createElement("div");
        leftButtonContainer.classList.add("vertical-button-container", "left-button-container");
        leftButtonContainer.append(this.getPrevButton().render());

        const rightButtonContainer = document.createElement("div");
        rightButtonContainer.classList.add("vertical-button-container", "right-button-container");
        rightButtonContainer.append(this.getNextButton().render());


        this.getPrevButton().addEventListener("click", async (e) => {
            this.prev();
        });
        this.getNextButton().addEventListener("click", async (e) => {
            this.next();
        });

        carousel.append(content, leftButtonContainer, rightButtonContainer);

        if(this.isModifiable()) {
            const fab = this.FABAdd();
            carousel.append(fab);
        }

        return carousel;
    }
    renderContent() {
        const content = this.getContent();
        this.clearImages();
        this.getData().map(async (pic) => {
            const item = new CarouselItem(pic, this.getActualUser(), this.getAPIURL());
            item.addEventListener("deleted", async (e) => {
                await this.reload();
                this.renderContent();
            });
            this.pushImage(item);
            this.getContent().append(item.render());
        });
        if(this.getImages().length > 0) {
            this.getImages()[0].enable();
        }
        this.updateNavigationButtonStatus();
    }
    FABAdd() {
        const button = document.createElement("button");
        const ripple = document.createElement("div");
        const focusRing = document.createElement("div");
        const icon = document.createElement("span");
        const touch = document.createElement("div");

        button.classList.add("mdc-fab", "mdc-fab--touch");
        ripple.classList.add("mdc-fab__ripple");
        focusRing.classList.add("mdc-fab__focus-ring");
        icon.classList.add("material-icons", "mdc-fab__icon");
        touch.classList.add("mdc-fab__touch");

        icon.innerText = "add";

        button.append(ripple, focusRing, icon, touch);

        button.addEventListener("click", async (e) => {
            await this.add();
        });

        return button;
    }

    updateNavigationButtonStatus() {
        const index = this.index;
        const len = this.getImages().length;
        if(index === 0) {
            this.getPrevButton().disable();
        } else {
            this.getPrevButton().enable();
        }

        if(index === len - 1) {
            this.getNextButton().disable();
        } else this.getNextButton().enable();

        if(len <= 1) {
            this.getNextButton().disable();
            this.getPrevButton().disable();
        }
    }
    next() {
        const imagesCount = this.getImages().length;
        if(this.index < imagesCount - 1) {
            this.index++;
            this.getImages()[this.index - 1].disable();
            this.getImages()[this.index].enable();
            this.updateNavigationButtonStatus();
        } else {
            console.log("No hay más fotos en el carousel. ");
        }
    }
    prev() {
        if(this.index > 0) {
            this.index--;
            this.getImages()[this.index + 1].disable();
            this.getImages()[this.index].enable();
            this.updateNavigationButtonStatus();
        } else {
            console.log("No hay más fotos en el carousel. ");
        }
    }
    add() {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.style.display = 'none';
        document.body.appendChild(fileInput);

        const uploadFile = async (file) => {

            const formData = new FormData();
            formData.append('file', file);

            const caption = prompt("Caption for the picture: ");
            formData.append("description", caption);



            try {
                const response = await fetch(`${this.getAPIURL()}/photos/`, {
                    method: 'POST',
                    body: formData,
                    credentials: "include"
                });

                if (!response.ok) {
                    const errorMessage = await response.text();
                    throw new Error(errorMessage || 'Hubo un error al subir el archivo.');
                }
                await this.reload();
                this.renderContent();
                console.log('Archivo subido exitosamente.');
                // Puedes hacer algo más con la respuesta si es necesario
            } catch (error) {
                console.error(error);
                console.error('Hubo un error al subir el archivo.');
            }
        };
        const triggerFileUpload = () => {
            fileInput.click();

            fileInput.addEventListener('change', async (event) => {
                const selectedFile = event.target.files[0];
                if (selectedFile) {
                    await uploadFile(selectedFile);
                }
            });
        };
        triggerFileUpload();

    }




}