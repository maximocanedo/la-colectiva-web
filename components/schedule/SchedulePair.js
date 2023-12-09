"use strict";
import {MDCIconButtonToggle} from "../material/components.js";
import VoteManager from "../VoteManager.js";

export default class SchedulePair {
    static convertTimeDifference(timeDifference) {
        const seconds = Math.floor(timeDifference / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (days > 0) {
            return `${days} día${days > 1 ? 's' : ''}`;
        } else if (hours > 0) {
            return `${hours} hora${hours > 1 ? 's' : ''}`;
        } else if (minutes > 0) {
            return `${minutes} minuto${minutes > 1 ? 's' : ''}`;
        } else {
            return `${seconds} segundo${seconds !== 1 ? 's' : ''}`;
        }
    }
    static formatHour(date) {
        const hours = String(date.getUTCHours()).padStart(2, '0');
        const minutes = String(date.getUTCMinutes()).padStart(2, '0');
        return `${hours}:${minutes}`;
    }
    constructor(data) {
        this.getData = () => data;
        this.getDeparture = () => data.schedules[0];
        this.getArrival = () => data.schedules[1];
        const departureTime = data.departureTime;
        this.getDepartureTime = () => {
            return new Date(departureTime);
        };
        this.getEnterprise = () => data.schedules[0].populatedEnterprise;
        this.getBoat = () => data.schedules[0].populatedBoat;
        this.getPath = () => data.schedules[0].populatedPath;
        const arrivalTime = data.arrivalTime;
        this.getArrivalTime = () => new Date(arrivalTime);

        this.getTotalVotes = () => ([0, 0]);

        const element = document.createElement("div");
        element.classList.add("schedule");
        this.getRootElement = () => element;
        this.isExpanded = () => element.classList.contains("_expanded");
        this.expand = () => element.classList.add("_expanded");
        this.contract = () => element.classList.remove("_expanded");

    }
    async init() {
        const dv__api = `http://colectiva.com.ar:5050/schedules/${this.getDeparture()._id}`;
        const dv = await VoteManager.load(dv__api);
        const av__api = `http://colectiva.com.ar:5050/schedules/${this.getArrival()._id}`;
        const av = await VoteManager.load(av__api);
        const votes = [
            (av.upvotes + dv.upvotes),
            (av.downvotes, dv.downvotes)
        ];
        this.getTotalVotes = () => votes;
        this.getDepartureVoteManager = () => dv.render();
        this.getArrivalVoteManager = () => av.render();

    }
    initToggleButton() {
        const button = document.createElement("button");
        button.classList.add("mdc-icon-button");
        const ripple = document.createElement("div");
        ripple.classList.add("mdc-icon-button__ripple");
        const focusRing = document.createElement("span");
        focusRing.classList.add("mdc-icon-button__focus-ring");
        const iconOn = document.createElement("i");
        iconOn.classList.add("material-icons", "mdc-icon-button__icon", "mdc-icon-button__icon--on");
        const icon = document.createElement("i");
        icon.classList.add("material-icons", "mdc-icon-button__icon");
        iconOn.innerText = "expand_less";
        icon.innerText = "expand_more";
        button.append(ripple, focusRing, iconOn, icon);
        const md = new MDCIconButtonToggle(button);
        button.addEventListener("MDCIconButtonToggle:change", e => {
           if(!e.detail.isOn) {
               this.contract();
           } else this.expand();
        });
        return button;
    }
    createEnterpriseLink() {
        const element = document.createElement("a");
        element.href = "/enterprises/details?id=" + this.getEnterprise()._id;
        element.innerText = this.getEnterprise().name;
        return element;
    }
    createBoatLink() {
        const element = document.createElement("a");
        element.href = "/boats/details?id=" + this.getBoat()._id;
        element.innerText = this.getBoat().name;
        return element;
    }
    createDepartureLink() {
        const element = document.createElement("a");
        element.href = "/schedules/details?id=" + this.getDeparture()._id;
        element.innerText = "Horario de salida";
        return element;
    }
    createArrivalLink() {
        const element = document.createElement("a");
        element.setAttribute("href", "/schedules/details?id=" + this.getArrival()._id);
        element.innerText = "Horario de llegada";
        return element;
    }
    createPathLink() {
        const element = document.createElement("a");
        element.href = "/paths/details?id=" + this.getDeparture().path;
        element.innerText = "Recorrido";
        return element;
    }
    initFooter() {
        const element = document.createElement("div");
        element.classList.add("moreInfo");
        const enterpriseLink = this.createEnterpriseLink();
        const boatLink = this.createBoatLink();
        const departureLink = this.createDepartureLink();
        const arrivalLink = this.createArrivalLink();
        const pathLink = this.createPathLink();
        const firstLine = document.createElement("span");
        firstLine.classList.add("schedule-f_estimatedTime", "smallText");
        firstLine.append(enterpriseLink, " · ", boatLink);
        const secondLine = document.createElement("span");
        secondLine.classList.add("schedule-f_tip", "smallText");
        secondLine.append("Más información: ", departureLink, " · ", arrivalLink, " · ", pathLink);
        element.append(firstLine, secondLine);
        return element;
    }
    createScheduleDescription(schedule) {
        const element = document.createElement("span");
        const hour = document.createElement("span");
        const dot = document.createElement("span");
        const dock = document.createElement("span");
        element.classList.add("schedule-description");
        hour.classList.add("_hour");
        dot.classList.add("_dot");
        dock.classList.add("_dock");
        hour.innerText = SchedulePair.formatHour(new Date(schedule.time));
        dot.innerText = "·";
        dock.innerText = schedule.populatedDock.name;
        element.append(hour, dot, dock);
        return element;
    }
    initBodyDepartureScheduleData() {
        const element = document.createElement("span");
        element.classList.add("schedule-f_start");
        const description = this.createScheduleDescription(this.getDeparture());
        const votes = this.getDepartureVoteManager();
        element.append(description, votes);
        return element;
    }
    initBodyEstimatedTime() {
        const element = document.createElement("span");
        element.classList.add("schedule-f_estimatedTime", "smallText");
        const text = "Tiempo de viaje estimado: " + SchedulePair.convertTimeDifference(this.getData().timeDifference);
        element.innerText = text;
        return element;
    }
    initBodyArrivalScheduleData() {
        const element = document.createElement("span");
        element.classList.add("schedule-f_end");
        const description = this.createScheduleDescription(this.getArrival());
        element.append(description);
        return element;
    }
    initBodyLine() {
        const element = document.createElement("div");
        element.classList.add("schedule-body__line");
        const newDot = () => {
            const dot = document.createElement("div");
            dot.classList.add("schedule-body__dots");
            return dot;
        };
        const dottedLine = document.createElement("div");
        dottedLine.classList.add("schedule-body__dottedLine");
        const dots = [newDot(), newDot()];
        element.append(dots[0], dottedLine, dots[1]);
        return element;
    }
    initDataContainer() {
        const element = document.createElement("div");
        element.classList.add("schedule-fullScheduleDataContainer");
        const departure = this.initBodyDepartureScheduleData();
        const estimatedTime = this.initBodyEstimatedTime();
        const arrival = this.initBodyArrivalScheduleData();
        element.append(departure, estimatedTime, arrival);
        return element;
    }
    initBody() {
        const element = document.createElement("div");
        element.classList.add("body");
        const line = this.initBodyLine();
        const dataContainer = this.initDataContainer();
        const arrivalVotesContainer = document.createElement("div");
        arrivalVotesContainer.classList.add("votes-container__footer");
        const arrivalVotes = this.getArrivalVoteManager();
        arrivalVotesContainer.append(arrivalVotes);
        const footer = this.initFooter();
        element.append(line, dataContainer, arrivalVotesContainer, footer);
        return element;
    }
    initHeaderLogo() {
        const element = document.createElement("div");
        element.classList.add("logo");
        // TODO Set logo as background.
        return element;
    }
    getInlineSchedulesTimes() {
        return `${SchedulePair.formatHour(this.getDepartureTime())} - ${SchedulePair.formatHour(this.getArrivalTime())}`;
    }
    initHeaderBodyHoursText() {
        const element = document.createElement("span");
        element.classList.add("hours");
        element.innerText = this.getInlineSchedulesTimes();
        return element;
    }
    initHeaderBodyBoatNameText() {
        const element = document.createElement("span");
        element.classList.add("boat");
        element.innerText = this.getBoat().name;
        return element;
    }
    initHeaderBodyPathNameText() {
        const element = document.createElement("span");
        element.classList.add("pathName");
        element.innerText = this.getPath().title;
        return element;
    }
    initHeaderBody() {
        const element = document.createElement("div");
        element.classList.add("header__body");
        const hours = this.initHeaderBodyHoursText();
        const boat = this.initHeaderBodyBoatNameText();
        const path = this.initHeaderBodyPathNameText();
        element.append(hours, boat, path);
        return element;
    }
    initHeaderStaticVoteCount() {
        const element = document.createElement("div");
        element.classList.add("votes");
        const positiveVotes__i = document.createElement("i");
        positiveVotes__i.classList.add("material-icons");
        positiveVotes__i.innerText = "arrow_upward";
        const negativeVotes__i = document.createElement("i");
        negativeVotes__i.classList.add("material-icons");
        negativeVotes__i.innerText = "arrow_downward";
        const positiveVotes__span = document.createElement("span");
        positiveVotes__span.innerText = this.getTotalVotes()[0];
        const negativeVotes__span = document.createElement("span");
        negativeVotes__span.innerText = this.getTotalVotes()[1];
        const positiveVotes = document.createElement("span");
        positiveVotes.classList.add("_k", "plusv");
        positiveVotes.append(positiveVotes__i, positiveVotes__span);
        const negativeVotes = document.createElement("span");
        negativeVotes.classList.add("_k", "lessv");
        negativeVotes.append(negativeVotes__i, negativeVotes__span);
        element.append(positiveVotes, negativeVotes);
        return element;
    }
    initHeader() {
        const element = document.createElement("div");
        element.classList.add("header");
        const logo = this.initHeaderLogo();
        const body = this.initHeaderBody();
        const votes = this.initHeaderStaticVoteCount();
        const button = this.initToggleButton();
        element.append(logo, body, votes, button);
        return element;
    }

    render() {
        const element = this.getRootElement();
        const header = this.initHeader();
        const body = this.initBody();
        element.append(header, body);
        return element;
    }
}