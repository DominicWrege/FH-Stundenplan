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
                // } else if (toDay.getHours() > 18) {
                //     toDay.setDate(toDay.getDate + 1);
                //     this.$.tabs.selected = toDay.toDateString().split(" ")[0];
            } else {
                this.$.tabs.selected = toDay.toDateString().split(" ")[0];
            }
        });

        if (localStorage.feedEventsUrl != null) {
            this.feedEventsUrl = localStorage.feedEventsUrl;
        }

    }
    showSettings() {
        this.$.settingsDialog.open();
    }
    showImpressumDialog() {
        this.$.settingsDialog.close();
        this.$.impressumDialog.open();
    }
    handleFeed(event) {
        let feedEventsUrl = this.baseFeedUrl + event.detail.course.split(" ")[0] + "/" +
            event.detail.course.split(" ")[1] + "/Events";
        localStorage.feedEventsUrl = feedEventsUrl;
        this.feedEventsUrl = feedEventsUrl;

    }
    handleFilter(event) {
        this.filterBy = event.detail;
    }
}
window.customElements.define(FhStundenplanApp.is, FhStundenplanApp);