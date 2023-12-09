"use strict";
import WaterBodyTag from "./WaterBodyTag.js";
export default class WaterBodyList {
    constructor() {
        this.list = [];
    }
    async init() {
        const source = await fetch("http://colectiva.com.ar:5050/waterBodies/", {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': "application/json"
            }
        });
        if(source.status === 200) {
            this.list = await source.json();
        }
    }
    static async load() {
        const wbl = new WaterBodyList();
        await wbl.init();
        return wbl;
    }
    render() {
        const ul = document.createElement("ul");
        ul.classList.add("waterbody-list");
        this.list.map(el => {
           const li = document.createElement("li");
           const tag = new WaterBodyTag(el);
           li.append(tag.render());
           ul.append(li);
        });
        return ul;
    }
}