"use strict";
import {MDCRipple} from "./material/components.js";

export default class VoteManager {
    constructor(data, apiURL = "") {
        this.upvotes = data.upvotes;
        this.downvotes = data.downvotes;
        this.getAPIURL = () => apiURL;
        this.queryURL = `${apiURL}/votes`;
    }
    async reload() {
        const queryURL = `${this.getAPIURL()}/votes`;
        const source = await fetch(queryURL, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': "application/json"
            }
        });
        if(source.status === 200) {
            const data = await source.json();
            const e = {upvotes: data.inFavorCount, downvotes: data.againstCount};
            this.reloadButtons(e.upvotes, e.downvotes);
        }
    }
    static async load(apiURL) {
        const queryURL = `${apiURL}/votes`;
        const source = await fetch(queryURL, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': "application/json"
            }
        });
        let vm = new VoteManager({upvotes: -1, downvotes: -1}, apiURL);
        if(source.status === 200) {
            const data = await source.json();
            return new VoteManager({upvotes: data.inFavorCount, downvotes: data.againstCount}, apiURL);
        }
        return vm;
    }
    renderVoteButton(iconName, labelValue, isUpvote = true) {
        const button = document.createElement("button");
        button.classList.add("mdc-button", "mdc-button--icon-leading");
        if (!isUpvote) {
            button.classList.add("button__downvote");
        }

        const buttonRipple = document.createElement("span");
        buttonRipple.classList.add("mdc-button__ripple");

        const buttonFocusRing = document.createElement("span");
        buttonFocusRing.classList.add("mdc-button__focus-ring");

        const icon = document.createElement("i");
        icon.classList.add("material-icons", "mdc-button__icon");
        icon.setAttribute("aria-hidden", "true");
        icon.innerText = iconName;

        const label = document.createElement("span");
        label.classList.add("mdc-button__label");
        label.innerText = labelValue;

        button.append(buttonRipple, buttonFocusRing, icon, label);
        new MDCRipple(button);

        return button;
    }
    render() {
        const upVoteBtn = this.renderVoteButton("arrow_upward", "", true);
        const downVoteBtn = this.renderVoteButton("arrow_downward", "", false);
        this.reloadButtons = (up, down) => {
            this.upvotes = up;
            this.downvotes = down;
            upVoteBtn.querySelector(".mdc-button__label").innerText =  this.upvotes;
            downVoteBtn.querySelector(".mdc-button__label").innerText = this.downvotes;
        }
        this.reloadButtons(this.upvotes, this.downvotes);
        upVoteBtn.addEventListener('click', async (e) => {
            const action = await fetch(
                `${this.getAPIURL()}/validate`, {
                    method: 'POST',
                    credentials: 'include'
                }
            );
            if(action.status === 200) {
                await this.reload();
            } else {
                console.log(action.status);
            }
        });
        downVoteBtn.addEventListener('click', async (e) => {
            const action = await fetch(
                `${this.getAPIURL()}/invalidate`, {
                    method: 'POST',
                    credentials: 'include'
                }
            );
            if(action.status === 200) {
                await this.reload();
            } else {
                console.log(action.status);
            }
        });
        const container = document.createElement("div");
        container.classList.add("votes-container");
        container.append(upVoteBtn, downVoteBtn);
        return container;
    }
}