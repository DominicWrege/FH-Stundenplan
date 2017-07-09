class StundenplanFeed extends Polymer.Element {
    static get is() { return "stundenplan-feed"; }
    static get properties() {
        return {
            name: {
                type: String,
                value: "stundenplan-feed"
            },
            response: {
                type: Array,
            },
            weekDay: {
                type: String,
                value: "Mon",
                observer: "reloadList"
            },
            feedEventsUrl: {
                type: String,
            },

            filterBy: {
                type: Object,
                value: {
                    groupLetter: "",
                    group: false,
                    qdl: false
                },
                observer: "reloadList"
            }
        }
    };

    formatTimePretty(time) {
        let timeFormated;
        if (time.substring(0, 1) == 1) {
            timeFormated = time.substring(0, 2) + ":" + time.substring(2, 4);
        } else {
            timeFormated = "0" + time.substring(0, 1) + ":" + time.substring(1, 3);
        }
        return timeFormated;
    }
    filter(items) {
        if (items != null) {
            return items.filter(item => {
                if (!this.filterBy.group && !this.filterBy.qdl)
                    return item.weekday == this.weekDay && item.name.indexOf("QdL") == -1;
                else if (!this.filterBy.qdl && this.filterBy.group)
                    return item.weekday == this.weekDay && this.checkGroup(this.filterBy.groupLetter, item.studentSet) && item.name.indexOf("QdL") == -1;
                else if (this.filterBy.qdl && !this.filterBy.group)
                    return item.weekday == this.weekDay;
                else
                    return item.weekday == this.weekDay && item.name.indexOf("QdL") == -1;
            });
        }
    }
    checkGroup(userGroupLetter, rangeGroupLetter) {
        let letters = rangeGroupLetter.split("-");
        let firstLetter = letters[0].substring(0, 1);

        if (rangeGroupLetter.indexOf(userGroupLetter) != -1) {
            return true;
        } else if (letters[1] == null) {
            return false;
        }
        let lastLetter = letters[1].substring(0, 1);
        let firstLetterAscii = firstLetter.charCodeAt(0);
        let lastLetterAcii = lastLetter.charCodeAt(0);
        let userGroupLetterAscii = userGroupLetter.charCodeAt(0);
        if (userGroupLetterAscii >= firstLetterAscii && userGroupLetterAscii <= lastLetterAcii) {
            return true;
        }
        return false;
    }
    reloadList() {
        if (this.response != null) {
            let tmp = [];
            tmp = this.response;
            this.response = [];
            this.response = tmp;

        }
    }
}
window.customElements.define(StundenplanFeed.is, StundenplanFeed);