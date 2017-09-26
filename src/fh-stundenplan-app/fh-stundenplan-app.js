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
            },
            page: {
                type: String,
                reflectToAttribute: true,
                observer: '_pageChanged',
            },
            // sortedEvents: {
            //     type: Object,
            //     value: {
            //         Mon: [],
            //         Tue: [],
            //         Wed: [],
            //         Thu: [],
            //         Fri: []
            //     }
            // },   
            sortedMon: {
                type: Array,
                value: [],
                notify: true
            },
            sortedTue: {
                type: Array,
                value: []
            },
            sortedWed: {
                type: Array,
                value: []
            },
            sortedThu: {
                type: Array,
                value: []
            },
            sortedFri: {
                type: Array,
                value: []
            },
            feedEventsUrl: {
                type: String,
            },
            response: {
                type: Array,
                value: [],
                observer: "handleResponse"
            },
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
    showSettings() {
        this.$.settingsDialog.open();
    }
    showImpressumDialog() {
        this.$.settingsDialog.close();
        this.$.impressumDialog.open();
    }
    handleFeedEvent(event) {
        // console.log(event.detail.value);
        let feedEventsUrl = this.baseFeedUrl + event.detail.value.split(" ")[0] + "/" +
            event.detail.value.split(" ")[1] + "/Events";
        localStorage.feedEventsUrl = feedEventsUrl;
        localStorage.course = event.detail.value;
        this.feedEventsUrl = feedEventsUrl;
        if (this.$.feed1.inEditMode) {
            this.$.settingsDialog.close();
        }
    }
    handleFilterEvent(event) {
        this.filterBy = event.detail;
    }
    handleCloseEvent() {
        this.$.settingsDialog.close();
    }
    handleResetEvent() {
        if (localStorage.savedEvents != null) {
            localStorage.removeItem("savedEvents");
            this.$.settingsDialog.close();
            this.$.feed.reloadList();
        }

    }
    handleResponse(values) {
        if (values != null && values.length > 0) {
            //this.sortedEvents[this.weekDay] = [];
            values.forEach((item) => {
                if (item.weekday == "Mon")
                    this.sortedMon.push(item);
                else if (item.weekday == "Tue")
                    this.sortedTue.push(item)
                else if (item.weekday == "Wed")
                    this.sortedWed.push(item);
                else if (item.weekday == "Thu") {
                    this.sortedThu.push(item);
                } else if (item.weekday == "Fri") {
                    this.sortedFri.push(item);
                }
            });
            this.sortedMon = this.sortedMon.slice();
            this.sortedTue = this.sortedTue.slice();
            this.sortedWed = this.sortedWed.slice();
            this.sortedThu = this.sortedThu.slice();
            this.sortedFri = this.sortedFri.slice();
        }
    }
    editMode(e) {
        this.mode = !this.mode;
        if (this.mode) {
            this.$.editFab.icon = "save";
            //this.set("listItems", this.sortedEvents[this.weekDay]);
            //this.unckeckAll();

        } else {
            //this.savedCheckedItems();
            this.$.editFab.icon = "edit";
            // if (this.tmpSavedItemsArray[this.weekDay].length > 0) {

            // }
        }
    }

}
window.customElements.define(FhStundenplanApp.is, FhStundenplanApp);