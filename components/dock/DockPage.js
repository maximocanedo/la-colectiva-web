"use strict";

import Carousel from "../Carousel.js";
import VoteManager from "../VoteManager.js";
import CommentContainer from "../CommentContainer.js";
import WaterBodyTag from "../WaterBodyTag.js";
import * as PropertyTag from "./PropertyTag.js";

export default class DockPage {
    constructor(data, id) {
        this.getId = () => id;
        this.getData = () => data;
        this.getAPIURL = () => `https://colectiva.com.ar:5050/docks/${this.getId()}`;

    }
    static async load(id) {
        const APIURL = `https://colectiva.com.ar:5050/docks/${id}`;
        const response = await fetch(APIURL, {
            credentials: "include",
            method: "GET"
        });
        if(response.ok) {
            const data = await response.json();
            const obj = new DockPage(data, id);
            await obj.init();
            return obj;
        } else {
            console.error(response.status);
            return null;
        }
    }
    async init() {
        const carousel = await Carousel.load(this.getAPIURL());
        this.getCarousel = () => carousel;
        const votes = await VoteManager.load(this.getAPIURL());
        this.getVoteManager = () => votes;
        const comments = await CommentContainer.load(this.getAPIURL());
        this.getCommentContainer = () => comments;
    }
    createCarousel() {
        return this.getCarousel().render();
    }
    createVoteManager() {
        return this.getVoteManager().render();
    }
    createCommentContainer() {
        return this.getCommentContainer().render();
    }
    createContainer() {
        const element = document.createElement("div");
        element.classList.add("dock-page");
        return element;
    }
    createTitle() {
        const element = document.createElement("span");
        element.classList.add("mdc-typography--headline6");
        element.innerText = this.getData().name;
        return element;
    }
    createWaterBodyTag() {
        const tag = new WaterBodyTag(this.getData().region);
        return tag.render();
    }
    createNotes() {
        const element = document.createElement("div");
        const title = document.createElement("b");
        const description = document.createElement("p");
        title.innerText = "Notas";
        description.innerText = this.getData().notes;
        element.append(title, description);
        return element;
    }
    createMap() {
        const element = document.createElement("div");
        element.id = "map";

        return element;
    }
    createGridCell(...elements) {
        const cell = document.createElement("div");
        cell.classList.add("page--grid-cell");
        cell.append(...elements);
        return cell;
    }
    renderDefaultPage() {
        const page = document.createElement("div");
        page.classList.add("dock-page--page", "dock-page--default-page");
        const title = this.createTitle();
        const propertyTag = PropertyTag.getTag(this.getData().status).render();
        const tag = this.createWaterBodyTag();
        const votes = this.createVoteManager();
        const map = this.createMap();
        const notes = this.createNotes();

        const titleCell = this.createGridCell(title);
        const tagsCell = this.createGridCell(propertyTag, tag);
        tagsCell.classList.add("tags-cell");
        const votesCell = this.createGridCell(votes);
        const mapCell = this.createGridCell(map);
        const notesCell = this.createGridCell(notes);

        page.append(titleCell, tagsCell, votesCell, mapCell, notesCell);
        return page;
    }

    initialize() {
        let coords = this.getData().coordinates;
        let mapOptions = {
            center: coords,
            zoom: 15
        };
        let map = new L.map('map' , mapOptions);
        let layer = new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');
        map.addLayer(layer);
        let marker = new L.Marker(coords);
        marker.addTo(map);
    }

    render() {
        const container = this.createContainer();
        const carousel = this.createCarousel();
        const page = this.renderDefaultPage();
        const comments = this.createCommentContainer();
        container.append(carousel, page, comments);
        return container;
    }
}