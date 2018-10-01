import { LitElement, html } from "@polymer/lit-element";
import { MyFilter } from "../stundenplan-feed/myFilter";
import { WeekEvents } from "../stundenplan-feed/weekEvents";
import '../elements';
import { fetcher } from "./../fetcher";
import { $$ } from "../util";
import { appStyle } from "./fh-stundenplan-app-style";

class FhStundenplanApp extends LitElement {
    _render({data, filterBy, activePage}) {
        return html`
        ${appStyle}
        <app-header-layout has-scrolling-region fullbleed>
            <app-header slot="header" effects="waterfall" fixed>
                <app-toolbar>
                    <div main-title>FH-Stundenplan</div>
                    <mwc-button on-click="${() => this.showSettings()}" icon="settings"></mwc-button>
                </app-toolbar>
                <paper-tabs id="tabs" auto-select-delay="0" no-slide
                            autoselect hide-scroll-buttons="true" scrollable
                            fit-container="true" selected="${activePage}" attr-for-selected="page">
                    <paper-tab page="0" day="Mon">Montag</paper-tab>
                    <paper-tab page="1" day="Tue">Dienstag</paper-tab>
                    <paper-tab page="2" day="Wed">Mittwoch</paper-tab>
                    <paper-tab page="3" day="Thu">Donnerstag</paper-tab>
                    <paper-tab page="4" day="Fri">Freitag</paper-tab>
                </paper-tabs>
            </app-header>
                <main>
                    <stundenplan-feed listOriginal="${data.mon}" filter="${filterBy}" weekday="mon" class="page" active?="${activePage == 0}"></stundenplan-feed>
                    <stundenplan-feed listOriginal="${data.tue}" filter="${filterBy}" weekday="tue" class="page" active?="${activePage == 1}" ></stundenplan-feed>
                    <stundenplan-feed listOriginal="${data.wed}" filter="${filterBy}" weekday="wed" class="page" active?="${activePage == 2}"></stundenplan-feed>
                    <stundenplan-feed listOriginal="${data.thu}" filter="${filterBy}" weekday="thu" class="page" active?="${activePage == 3}"></stundenplan-feed>
                    <stundenplan-feed listOriginal="${data.fri}" filter="${filterBy}" weekday="fri" class="page" active?="${activePage == 4}"></stundenplan-feed>
                    <card-element class="page" active?="${activePage == 5}" >
                        <stundenplan-settings id="settings" active?="${activePage == 5}"
                                            on-close="${() => this.closeSettings()}" 
                                            on-feed="${event => this.handleFeedEvent(event)}" 
                                            on-reset="${() => this.handleResetEvent()}"
                                            on-filter="${event => this.filterBy = event.detail}">
                        </stundenplan-settings>
                    </card-element>
                </main>
                
        </app-header-layout>`;
    }

    static get is() { return "fh-stundenplan-app"; }
    constructor(){
        super();
        this._baseFeedUrl = "https://api.fhstundenplan.de";
        if (localStorage.feedEventsUrl !== undefined) {
            this.feedEventsUrlChanged(localStorage.feedEventsUrl);
        }
        this.data = new WeekEvents();
        this.filterBy = new MyFilter();
        const toDay = new Date();
        if (toDay.getDay() === 0 || toDay.getDay() === 6) {
            this.activePage = 0;
        } else {
            this.activePage = toDay.getDay() - 1;
        }
        this._lastActivePage = this.activePage;
        
    }
    static get properties() {
        return {
            data: Object,
            filterBy: Object,
            activePage: Number
        }
    }
    _firstRendered() {
        const paperTabs = $$(this, "#tabs");
        paperTabs.addEventListener("click", event => {
            this.activePage = paperTabs.selected;
        });
        if (localStorage.feedEventsUrl == null) {
            this.showSettings();
        }
    }
    showSettings() {
        if (this.activePage === 5) {
            this.closeSettings();
        } else {
            this._lastActivePage = this.activePage;
            this.activePage = 5;
            $$(this, "#tabs").style.visibility = "hidden";
        }
    }
    handleFeedEvent(event) {
        console.log("handlefeeedEEvent");
        const eventDetail = event.detail.course.split(" ");
        const courseOfStudy = eventDetail[0];
        const semestester = eventDetail[1];
        const feedEventsUrl = `${this._baseFeedUrl}/events/${courseOfStudy}/${semestester}`;
        localStorage.feedEventsUrl = feedEventsUrl;
        this.feedEventsUrlChanged(feedEventsUrl);
        console.log(feedEventsUrl);
    }
    closeSettings() {
        $$(this, "#settings").impressumVisible = false;
        $$(this, "#tabs").style.visibility = "visible";
        //$$(this, "#pages").select(this.activePage);
        this.activePage = this._lastActivePage;
    }
    handleResetEvent() {
        //fix
        console.log("hdsiadb");
        if (localStorage.savedEvents !== undefined) {
            let cachedEvents = JSON.parse(localStorage.savedEvents);
            cachedEvents[this._lastSelectedDay] = [];
            localStorage.savedEvents = JSON.stringify(cachedEvents);
            console.log(cachedEvents[this._lastSelectedDay]);
            this.closeSettings();
            //call reset method for the selected day 
            //fix it
            //this.$.pages.selectedItem.reset();
        }
    }
    feedEventsUrlChanged(url){
        console.log("feed urls changed");
        fetcher(url).then(resp => this.data = resp);
    }
}
window.customElements.define(FhStundenplanApp.is, FhStundenplanApp);
