import Comment from './../components/Comment.js';
import CommentContainer from "../components/CommentContainer.js";
import VoteManager from "../components/VoteManager.js";
import * as material from "./../components/material.components.js";
import {MDCMenu} from "../components/material/components.js";
import Carousel from "../components/Carousel.js";
import FloatingSheet from "../components/material/dialog/FloatingSheet.js";
import EnterprisePage from "../components/EnterprisePage.js";


(async () => {
    const someAPIURL = "http://localhost:3000/boats/6564e1d00d97905b5799e94f";
    const carousel = await Carousel.load(someAPIURL);
    //document.querySelector("#root").append(carousel.render());
    console.log(carousel);
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    const e = await EnterprisePage.load(id);
    const d = new FloatingSheet();
    d.init();
    d.getContent().append(e.render());
    d.open();
    console.log(d);
})();