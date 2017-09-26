class StundenplanFeed extends Polymer.Element {
    static get is() { return "stundenplan-feed"; }
    static get properties() {
        return {
            name: {
                type: String,
                value: "stundenplan-feed"
            },
            mode: {
                type: Boolean,
                value: false,
                notify: true
            },
            weekDay: {
                type: String,
                value: "Mon",
                observer: "weekDayChanged"
            },
            tmpSavedItemsArray: {
                type: Object,
                value: {
                    Mon: [],
                    Tue: [],
                    Wed: [],
                    Thu: [],
                    Fri: []
                }
            },
            listItems: {
                type: Array,
                observer: "listItemsChanged"
            },
            filterBy: {
                type: Object,
                value: {
                    groupLetter: String,
                    group: Boolean,
                    qdl: Boolean
                },
                observer: "reloadList"
            }
        };
    }

    constructor() {
        super();
        if (localStorage.responeCache != null) {
            this.response = JSON.parse(localStorage.responeCache);
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
    filter(items) {
        if (items != null) {
            return items.filter(item => {
                if (!this.filterBy.group && !this.filterBy.qdl)
                    return item.name.indexOf("QdL") == -1;
                else if (!this.filterBy.qdl && this.filterBy.group)
                    return this.checkGroup(this.filterBy.groupLetter, item.studentSet) && item.name.indexOf("QdL") == -1;
                else
                    return (this.filterBy.qdl && !this.filterBy.group) || item.name.indexOf("QdL") == -1;
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
            if (this.sortedEvents != null) {
                // if (this.inEditMode) {
                //     this.unckeckAll();
                //     this.set("listItems", this.sortedEvents[this.weekDay]);
                // } else {
                //     if (localStorage.savedEvents != null) {
                //         let savedEvents = JSON.parse(localStorage.savedEvents);
                //         if (savedEvents[this.weekDay].length > 0) {
                //             this.set("listItems", savedEvents[this.weekDay]);
                //         } else {
                //             this.set("listItems", []);
                //             this.set("listItems", this.sortedEvents[this.weekDay]);
                //         }
                //     } else {
                //         this.set("listItems", []);
                //         this.set("listItems", this.sortedEvents[this.weekDay]);
                //     }
                // }
            }
        }
        // editMode(e) {
        //     this.mode = !this.mode;
        //     if (this.mode) {
        //         this.$.editFab.icon = "save";
        //         //this.set("listItems", this.sortedEvents[this.weekDay]);
        //         this.unckeckAll();

    //     } else {
    //         this.savedCheckedItems();
    //         if (this.tmpSavedItemsArray[this.weekDay].length > 0) {
    //             this.$.editFab.icon = "edit";
    //             // this.set("listItems", []);
    //             // this.tmpSavedItemsArray[this.weekDay].sort((a, b) => {
    //             //     return a.timeBegin - b.timeBegin;
    //             // });

    //             //     if (localStorage.savedEvents != null) {
    //             //         let oldEvents = JSON.parse(localStorage.savedEvents);
    //             //         oldEvents[this.weekDay] = this.tmpSavedItemsArray[this.weekDay];
    //             //         this.userSavedEvents = oldEvents
    //             //         localStorage.savedEvents = JSON.stringify(oldEvents);
    //             //     } else {
    //             //         localStorage.savedEvents = JSON.stringify(this.tmpSavedItemsArray);
    //             //     }
    //             //     this.set("listItems", this.tmpSavedItemsArray[this.weekDay]);
    //             //     this.tmpSavedItemsArray[this.weekDay] = [];
    //             // } else {
    //             //     this.$.toast.opened = true;
    //             //     this.mode = !this.mode;
    //         }
    //     }
    // }
    newItemChecked(event) {
        let selectedItem = event.model.item;
        if (!event.target.checked) {
            let index = this.tmpSavedItemsArray[this.weekDay].indexOf(selectedItem);
            this.tmpSavedItemsArray[this.weekDay].splice(index, 1);
        } else {
            if (this.tmpSavedItemsArray[this.weekDay].indexOf(selectedItem) == -1)
                this.tmpSavedItemsArray[this.weekDay].push(selectedItem);
        }
    }
    unckeckAll() {
        let liste = this.shadowRoot.querySelectorAll('paper-material paper-checkbox');
        liste.forEach((item) => {
            if (item.checked) {
                item.checked = false;
            }
        });
    }
    weekDayChanged() {
        if (this.inEditMode) {
            //this.set("listItems", this.sortedEvents[this.weekDay]);
        } else {
            // if (localStorage.savedEvents != null) {
            //     let savedEvents = JSON.parse(localStorage.savedEvents);
            //     if (savedEvents[this.weekDay].length > 0) {
            //         this.set("listItems", savedEvents[this.weekDay]);
            //     } else {
            //         this.set("listItems", []);
            //         this.set("listItems", this.sortedEvents[this.weekDay]);
            //     }
            // } else {
            //     this.set("listItems", []);
            //     this.set("listItems", this.sortedEvents[this.weekDay]);
            // }
        }
    }

    listItemsChanged(value) {
        if (value.length > 0) {
            //console.log(value);
            //this.savedList = value;
            //console.log(this.$.storage.data);
        }

    }
    savedCheckedItems() {
        let liste = this.shadowRoot.querySelectorAll('paper-material paper-checkbox');
        liste.forEach((item) => {
            if (item.checked && this.tmpSavedItemsArray[this.weekDay].indexOf(item.data) == -1) {
                this.tmpSavedItemsArray[this.weekDay].push(item.data);
            }
        });
    }

}
window.customElements.define(StundenplanFeed.is, StundenplanFeed);