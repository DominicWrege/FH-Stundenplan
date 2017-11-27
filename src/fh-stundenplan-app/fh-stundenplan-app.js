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
                value: "https://ws.inf.fh-dortmund.de/timetable/current/rest/CourseOfStudy/"
            }
        };
    }

    connectedCallback() {
        super.connectedCallback();
        Polymer.RenderStatus.afterNextRender(this, function() {
            if (localStorage.feedEventsUrl == null) {
                this.$.settingsDialog.open();
            }
            let toDay = new Date();
            if (toDay.getDay() == 0 || toDay.getDay() == 6) {
                this.$.tabs.selected = "Mon";
            } else {
                this.$.tabs.selected = toDay.toDateString().split(" ")[0];
            }
        });

        if (localStorage.feedEventsUrl != null) {
            this.feedEventsUrl = localStorage.feedEventsUrl;
        }

    }
    showImpressumDialog() {
        this.$.settingsDialog.close();
        this.$.impressumDialog.open();
    }
    showSettings(){
        this.$.settingsDialog.open();
    }
    closeImpressum(){
        this.$.impressumDialog.close();
    }
    handleFeedEvent(event) {
        let feedEventsUrl = this.baseFeedUrl + event.detail.course.split(" ")[0] + "/" +
            event.detail.course.split(" ")[1] + "/Events";
        localStorage.feedEventsUrl = feedEventsUrl;
        this.feedEventsUrl = feedEventsUrl;
        // if (this.$.pages.selectedItem.inEditMode === true) {
        //     this.$.settingsDialog.close();
        // }
    }
    handleFilterEvent(event) {
        this.filterBy = event.detail;
    }
    handleCloseEvent() {
        this.$.settingsDialog.close();
    }
    handleResetEvent() {
        if (localStorage.savedEvents != null) {
            let cachedEvents = JSON.parse(localStorage.savedEvents);
            cachedEvents[this.$.pages.selected] = [];
            localStorage.savedEvents = JSON.stringify(cachedEvents);
            // localStorage.removeItem("savedEvents");
            this.$.settingsDialog.close();
            this.$.pages.selectedItem.reset();
        }

    }

}
window.customElements.define(FhStundenplanApp.is, FhStundenplanApp);