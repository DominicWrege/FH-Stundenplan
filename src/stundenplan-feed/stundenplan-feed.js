import { StundenplanPage } from '../stundenplan-page';
import { html } from '@polymer/lit-element';
import { WeekEvents } from "./weekEvents";
import { MyFilter } from "./myFilter";
import { feedStyle } from "./stundenplan-feed-style";
import { includes, enumerate } from "../util";


class StundenplanFeed extends StundenplanPage {
    _render({ listItems, inEditMode }) {
        const htmlEventsList = enumerate(listItems)
            .filter(([_i, item]) => this.feedFilter(item))
            .map(([index, item]) => this.renderItem(item, inEditMode, index));
        return html`
            ${feedStyle}
            <section class="paper-list">
                    ${htmlEventsList}
            </section>
            ${this.renderFabs()}
        `;
    }

    static get is() { return "stundenplan-feed"; }
    static get properties() {
        return {
            inEditMode: Boolean,
            weekday: String,
            listOriginal: Array,
            filter: Object,
            listItems: Array
        }
    }
    constructor() {
        super();
        this.inEditMode = false;
        this.weekday = "mon";
        this.listItems = [];
        this._listOriginal = [];
        this._filterBy = new MyFilter();
        this._loaded = false;
        this._tmpSavedItems = new WeekEvents();
    }
    set listOriginal(list) {
        this.listItems = list;
        this._listOriginal = list;
    }
    //just attribute
    set filter(newFilter) {
        this._filterBy = newFilter;
        this._requestRender();
    }
    renderItem(item, inEditMode, index) {
        return html`
            <card-element>
                ${ inEditMode ? html`<paper-checkbox data="${index}" on-tap="${(e) => this.newItemChecked(e)}"></paper-checkbox>` : ""}
                <table>
                    <tbody>
                        <tr>
                            <td><b>${item.courseType} ${item.name}</b></td>
                        </tr>
                        <tr>
                            <td>${item.timeBegin} - ${item.timeEnd} <span></span>| <span>${item.roomId}</span></td>
                        </tr>
                        <tr>
                            <td>${item.studentSet} <span></span>| <span>${item.lecturerName}</span></td>
                        </tr>
                    </tbody>
                </table>
                <hr>
            </card-element>
        `;
    }
    renderFabs() {
        if (this.inEditMode) {
            return html`<mwc-fab icon="save" id="saveFab" on-click="${() => this.saveItems()}"></mwc-fab>`;
        } 
        return html`<mwc-fab icon="edit" id="editFab" on-click="${() => this.editMode()}"></mwc-fab>`;
    }
    feedFilter(item) {
        if (item !== undefined) {
            if (!this._filterBy.group && !this._filterBy.qdl)
                return item.name.indexOf("QdL") == -1;
            else if (this._filterBy.qdl && this._filterBy.group)
                return this.checkGroup(this._filterBy.groupLetter, item.studentSet);
            else if (!this._filterBy.qdl && this._filterBy.group)
                return this.checkGroup(this._filterBy.groupLetter, item.studentSet) && item.name.indexOf("QdL") == -1;
            return true;
        }
    }
    loadFromCache() {
        if (localStorage.savedEvents !== undefined) {
            let cachedEvents = JSON.parse(localStorage.savedEvents);
            if (cachedEvents[this.weekday].length > 0) {
                this.listItems = cachedEvents[this.weekday];
                return this._loaded = true;
            }
        }
        return false;
    }

    itemsLoaded(values) {
        if (!this.loadFromCache()) {
            console.log(values);
            this.set("listItems", values);
        }
        if (this.inEditMode) {
            this.unckeckAll();
        }
    }
    checkGroup(userGroupLetter, rangeGroupLetter) {
        const letters = rangeGroupLetter.split("-");
        const firstLetter = letters[0].substring(0, 1);
        if (rangeGroupLetter.indexOf(userGroupLetter) !== -1) {
            return true;
            //change to ===
        } else if (letters[1] == null) {
            return false;
        }
        const lastLetter = letters[1].substring(0, 1);
        const firstLetterAscii = firstLetter.charCodeAt(0);
        const lastLetterAcii = lastLetter.charCodeAt(0);
        if (typeof (userGroupLetter) === "string") {
            const userGroupLetterAscii = userGroupLetter.charCodeAt(0);
            return userGroupLetterAscii >= firstLetterAscii && userGroupLetterAscii <= lastLetterAcii;
        }
        return false;
    }
    reset() {
        this.listItems = this._listOriginal;
        //this._requestRender(); maybe
    }
    editMode(event) {
        this.inEditMode = !this.inEditMode;
        this.listItems = this._listOriginal;
        this.unckeckAll();
    }
    saveItems() {
        if (this._tmpSavedItems[this.weekday].length > 0) {
            //this.listItems = []; maybe
            if (localStorage.savedEvents !== undefined) {
                let oldEvents = JSON.parse(localStorage.savedEvents);
                this._tmpSavedItems[this.weekday] = oldEvents[this.weekday]
                    .filter(item =>
                        !includes(this._tmpSavedItems[this.weekday], item, item => item.courseId))
                    .concat(this._tmpSavedItems[this.weekday]);
                oldEvents[this.weekday] = this._tmpSavedItems[this.weekday];
                localStorage.savedEvents = JSON.stringify(oldEvents);
            } else {
                localStorage.savedEvents = JSON.stringify(this._tmpSavedItems);
            }
            this.listItems = this._tmpSavedItems[this.weekday];
            this._tmpSavedItems = [];
        } else {
            this.loadFromCache();
        }
        this.inEditMode = !this.inEditMode;
    }

    newItemChecked(event) {
        const selectedIndex = event.target.data;
        //check
        if (event.target.checked) {
            if (this._tmpSavedItems[this.weekday].indexOf(this.listItems[selectedIndex]) === -1) {
                console.log(this.listItems[selectedIndex]);
                this._tmpSavedItems[this.weekday].push(this.listItems[selectedIndex]);
            }
        } else {
            //uncheked
            const index = this._tmpSavedItems[this.weekday].indexOf(this.listItems[selectedIndex]);
            this._tmpSavedItems[this.weekday].splice(index, 1);
        }
    }
    unckeckAll() {
        const liste = this.shadowRoot.querySelectorAll('card-element paper-checkbox');
        liste.forEach((item) => {
            if (item.checked) {
                item.checked = false;
            }
        });
    }
    sortbyTime(a, b) {
        return a.timestampBegin - b.timestampBegin;
    }
}
window.customElements.define(StundenplanFeed.is, StundenplanFeed);



