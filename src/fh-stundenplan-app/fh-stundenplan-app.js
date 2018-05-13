class FhStundenplanApp extends Polymer.Element {
    static get is() { return "fh-stundenplan-app"; }
    static get properties() {
        return {
            name: {
                type: String,
                value: "fh-stundenplan-app"
            },
            baseFeedUrl: {
                type: String,
                value: "https://api.fhstundenplan.de"
            },
            lastSelectedDay: Number

        };
    }
    connectedCallback() {
        super.connectedCallback();
        const toDay = new Date();
        this.lastSelectedDay = toDay.getDay() - 1;  
        Polymer.RenderStatus.afterNextRender(this, () => {
            if (toDay.getDay() == 0 || toDay.getDay() == 6) {
                this.$.tabs.selected = 0;
                this.lastSelectedDay = this.$.tabs.selected;
            } else {
                this.$.tabs.selected = this.lastSelectedDay;
            }       
            if (localStorage.feedEventsUrl == null) {
                this.showSettings();
            } 
        });

        if (localStorage.feedEventsUrl != null) {
            this.feedEventsUrl = localStorage.feedEventsUrl;
        }
    }
    showSettings(){
        if (this.$.tabs.selected === 5){
            this.closeSettings();
        } else {
            if (this.$.tabs.selected != undefined){
                this.lastSelectedDay = this.$.tabs.selected;
            }
            this.$.pages.select(5);
            this.$.tabs.style.visibility = "hidden";
        }
    }
    closeImpressum(){
        this.$.pages.select(0);
    }
    handleFeedEvent(event) {
        console.log(event);
        // let feedEventsUrl = this.baseFeedUrl + event.detail.course.split(" ")[0] + "/" +
        //     event.detail.course.split(" ")[1] + "/Events";
        console.log(event.detail.course);
        const eventDetail = event.detail.course.split(" ");
        const courseOfStudy =  eventDetail[0];
        const semestester = eventDetail[1]
        let feedEventsUrl = `${this.baseFeedUrl}/events/${courseOfStudy}/${semestester}`;
        console.log(feedEventsUrl);
        localStorage.feedEventsUrl = feedEventsUrl;
        this.feedEventsUrl = feedEventsUrl;
        console.log(this.feedEventsUrl);
    }
    handleFilterEvent(event) {
        this.filterBy = event.detail;
    }
    closeSettings() {
        this.$.settings.impressumVisible = false;
        this.$.tabs.style.visibility = "visible";
        this.$.pages.select(this.lastSelectedDay);
    }
    handleResetEvent() {
        if (localStorage.savedEvents != null) {
            let cachedEvents = JSON.parse(localStorage.savedEvents);
            cachedEvents[this.$.pages.selected] = [];
            localStorage.savedEvents = JSON.stringify(cachedEvents);
            this.closeSettings();
            //call reset method for the selected day
            this.$.pages.selectedItem.reset();
        }
    }

}
window.customElements.define(FhStundenplanApp.is, FhStundenplanApp);