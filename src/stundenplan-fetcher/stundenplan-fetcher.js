class StundenplanFetcher extends Polymer.Element {

    static get is() {
        return "stundenplan-fetcher";
    }

    static get properties() {
        return {
            response: {
                type: Array,
                observer: "handleResponse"
            },
            sortedEvents: {
                type: Object,
                notify: true
            },    
            feedEventsUrl: String
        };
    }

    constructor() {
        super();
    }

    handleResponse(values) {
        if (values != null && values.length > 0) {
            //this.sortedEvents[this.weekDay] = [];
            let eventsBuffer = new WeekEvents();

            values.forEach((item) => {
                item.timeBegin = this.formatTimePretty(item.timeBegin);
                item.timeEnd = this.formatTimePretty(item.timeEnd);
                eventsBuffer[item.weekday].push(item);
            });
            // this.sortedEvents = null;;
            this.set("sortedEvents", eventsBuffer);
        }
    }

    formatTimePretty(time) {
        let timeFormated;
        if (time.substring(0, 1) == 1) {
            timeFormated = time.substring(0, 2) + ":" + time.substring(2, 4);
        } else {
            timeFormated = "0" + time.substring(0, 1) + ":" + time.substring(1, 3);
        }
        return timeFormated;
    }

    ready() {
        super.ready();

        // Polymer.RenderStatus.afterNextRender(this, function() {
            
        // });
    }

}

window.customElements.define(StundenplanFetcher.is, StundenplanFetcher);