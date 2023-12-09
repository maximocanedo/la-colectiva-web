"use strict";
import Carousel from "../Carousel.js";
import EnterpriseTag from "../EnterpriseTag.js";
import VoteManager from "../VoteManager.js";
import CommentContainer from "../CommentContainer.js";

export default class BoatPage {
    constructor(data, id) {
        this.getId = () => id;
        this.getData = () => data;
        this.getAPIURL = () => `http://localhost:3000/boats/${this.getId()}`;
    }
    createContainer() {
        const element = document.createElement("div");
        element.classList.add("boat-page");
        return element;
    }
    createCarousel() {
        return this.getCarousel != null ? this.getCarousel().render() : "NO CAROUSEL LOADED. ";
    }
    async init() {
        const carousel = await Carousel.load(this.getAPIURL());
        this.getCarousel = () => carousel;
        const votes = await VoteManager.load(this.getAPIURL());
        const comments = await CommentContainer.load(this.getAPIURL());
        this.createVoteManager = () => votes;
        this.createCommentsContainer = () => comments;
    }
    static async load(id) {
        const APIURL = `http://localhost:3000/boats/${id}`;
        const source = await fetch(APIURL, {
            credentials: "include",
            method: "GET"
        });
        if(source.status === 200) {
            const data = await source.json();
            const boat = new BoatPage(data, id);
            await boat.init();
            return boat;
        }
        console.log(source.status);
        const e = new BoatPage({}, id);
        await e.init();
        return e;
    }
    createTitle() {
        const element = document.createElement("h3");
        element.classList.add("mdc-typography--headline6", "boat-page__title");
        element.innerText = this.getData().name;
        return element;
    }
    createEnterpriseTag() {
        const tag = new EnterpriseTag(this.getData().enterprise);
        return tag.render();
    }
    createMat() {
        const element = document.createElement("span");
        element.classList.add("mdc-typography-body1", "boat-page__defaultView__mat");
        element.innerText = "Mat.: " + this.getData().mat;
        return element;
    }
    renderDefaultView() {
        const container = document.createElement("div");
        container.classList.add("boat-page__defaultView");
        const title = this.createTitle();
        const enterpriseTag = this.createEnterpriseTag();
        const mat = this.createMat();
        container.append(title, enterpriseTag, mat);
        return container;
    }
    render() {
        const container = this.createContainer();
        const carousel = this.createCarousel();
        const view = this.renderDefaultView();
        const votes = this.createVoteManager();
        const comments = this.createCommentsContainer();
        container.append(carousel, view, votes.render(), comments.render());
        return container;
    }
}