class StundenplanFeed extends Polymer.Element {
    static get is() { return "stundenplan-feed"; }
    static get properties() {
        return {
            inEditMode: {
                type: Boolean,
                value: false,
                notify: true,
                reflectToAttribute: true
            },
            
            weekDay: String,
            _tmpSavedItems: Object,
            listItems: {
                type: Array,
                value: []
            },
            listOriginal: {
                type: Array,
                observer: "itemsLoaded"
            },
            filterBy: {
                type: Object,
                observer: "reloadList"
            },
            loaded: {
                type:Boolean,
                value: false
            }
        }
    };

    constructor() {
        super();
        this._tmpSavedItems = new WeekEvents();
        this.filterBy = new MyFilter();
    }
    filter(items) {
        if (items !== null) {
            return items.filter(item => {
                if (!this.filterBy.group && !this.filterBy.qdl)
                    return item.name.indexOf("QdL") == -1;
                else if (this.filterBy.qdl && this.filterBy.group)
                    return this.checkGroup(this.filterBy.groupLetter, item.studentSet);
                else if (!this.filterBy.qdl && this.filterBy.group)
                    return this.checkGroup(this.filterBy.groupLetter, item.studentSet) && item.name.indexOf("QdL") == -1;
                else
                    return true;
            });
        }
    }
    loadFromCache(){
        if (localStorage.savedEvents !== undefined) {
            let cachedEvents = JSON.parse(localStorage.savedEvents);
            if(cachedEvents[this.weekDay].length > 0){
                this.listItems = cachedEvents[this.weekDay];
                return this.loaded = true;
            }
        }
        return false;
    }

    itemsLoaded(values){
        if (!this.loadFromCache()) {
            this.set("listItems", values);
        }
        if (this.inEditMode) {
            this.unckeckAll();
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
            if(typeof(userGroupLetter) === "string"){
                let userGroupLetterAscii = userGroupLetter.charCodeAt(0);
                return userGroupLetterAscii >= firstLetterAscii && userGroupLetterAscii <= lastLetterAcii;
            }
        
        return false;
    }
    reloadList() {
        if (this.listItems.length > 0){
            if (this.inEditMode) {
                this.unckeckAll();
                this.reset();
            } else {
                if (!this.loadFromCache()) {
                    this.listItems = this.listItems.slice();
                } else {
                    this.reset();
                }
            }
        }
       
    }
    reset(){
        this.set("listItems", []);
        this.set("listItems", this.listOriginal);
    }
    editMode(event) {
        this.inEditMode = !this.inEditMode;
        this.set("listItems", this.listOriginal);
        this.unckeckAll();
    }
    saveItems(){
        if (this._tmpSavedItems[this.weekDay].length > 0) {
            this.set("listItems", []);
            if (localStorage.savedEvents != null) {
                let oldEvents = JSON.parse(localStorage.savedEvents);
                this._tmpSavedItems[this.weekDay] = oldEvents[this.weekDay]
                    .filter(item => 
                        !includes(this._tmpSavedItems[this.weekDay], item, item => item.courseId))
                    .concat(this._tmpSavedItems[this.weekDay]);
                oldEvents[this.weekDay] = this._tmpSavedItems[this.weekDay];
                localStorage.savedEvents = JSON.stringify(oldEvents);
            } else {
                localStorage.savedEvents = JSON.stringify(this._tmpSavedItems);
            }
            this.set("listItems", this._tmpSavedItems[this.weekDay]);
            this._tmpSavedItems[this.weekDay] = [];
        }else{
            this.loadFromCache();
        }
        this.inEditMode = !this.inEditMode;
    }
    
    newItemChecked(event) {
        console.log(this.weekDay);
        let selectedItem = event.model.item;
        //uncheck
        if (!event.target.checked) {
            let index = this._tmpSavedItems[this.weekDay].indexOf(selectedItem);
            this._tmpSavedItems[this.weekDay].splice(index, 1);
        } else{
        //cheked
            if (this._tmpSavedItems[this.weekDay].indexOf(selectedItem) == -1)
                this._tmpSavedItems[this.weekDay].push(selectedItem);
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
    sortbyTime(a,b){
        return a.timestampBegin - b.timestampBegin;
    }
 
}
window.customElements.define(StundenplanFeed.is, StundenplanFeed);

function includes(array, item, func) {
    return array.reduce((acc, otherItem) => acc || (func(otherItem) === func(item)), false);
}
