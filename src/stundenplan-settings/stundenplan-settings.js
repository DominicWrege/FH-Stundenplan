import { StundenplanPage } from '../stundenplan-page';
import { html } from '@polymer/lit-element';
import { fetcher } from "./../fetcher";
import { settingsStyle } from "./stundenplan-settings-style";
import { $$ } from "../util";

class StundenplanSettings extends StundenplanPage {
    _render({ _allGroupLetters, response, impressumVisible}) {
        return html`
                <section id="settings"> 
                    ${settingsStyle}
                    <h2>Einstellungen</h2>
                    <label class="label-select" for="courseMenu"><small>Studiengang</small></label>
                    <select id="courseMenu">
                        ${response.map(item => this.renderCourseList(item))}
                    </select>
                    <label class="label-select" for="gruppenbuchstabe"><small>Gruppenbuchstabe</small></label>
                    <select id="gruppenbuchstabe">
                        ${_allGroupLetters.map(letter => html`<option value="${letter}">${letter}</option>`)}
                    </select>
                        <!-- <paper-toggle-button id="filterByGroup"></paper-toggle-button>  -->
                    <section class="switch">
                        <mwc-switch id="filterByGroup"></mwc-switch>
                        <label for="filterByGroup">Nach Gruppenbuchstabe filtern</label><br>
                    </section>
                    <section class="switch">
                        <mwc-switch id="qdlButton"></mwc-switch>
                        <label for="qdlButton"> QDL's anzeigen</label><br>
                    </section>
                    <mwc-button raised id="reset-btn" on-click="${() => this.reset()}">Stundenplan zurücksetzen</mwc-button>
                    <mwc-button raised id="close-btn" on-click="${() => this.close()}">Schließen</mwc-button>
                    <br>
                    <mwc-button on-click="${() => this.hideShowImpressum()}">Impressum</mwc-button>
                </section>
                <stundenplan-impressum style="display: none"></stundenplan-impressum>
            `;

    }
    static get is() { return "stundenplan-settings"; }
    static get properties() {
        return {
            _allGroupLetters: Array,
            impressumVisible: Boolean,
            response: Array
        };
    }
    constructor() {
        super();
        this.response = [];
        this._qdl = false;
        this._group = false;
        this._groupLetter = "";
        this.impressumVisible = false;
        this._course = "";
        this._alreadyRendered = false;
        this._allGroupLetters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K",
            "L", "M", "N", "O", "P", "Q", "L", "R", "S", "T", "U",
            "V", "W", "Y", "Z"];

    }
    _didRender(props, changedProps, prevProps) {
       
        if (!this._alreadyRendered){
            const qdlButton = $$(this, "#qdlButton");
            const filterByGroupButton = $$(this, "#filterByGroup");
            const groupLetterSelect = $$(this, "#gruppenbuchstabe");
            const apiCoursesUrl = "https://api.fhstundenplan.de/courses";
            const coursesSelelct = $$(this, "#courseMenu");
            fetcher(apiCoursesUrl).then(data => {
                this.response = data;
                this._course = localStorage.course;
                coursesSelelct.value = this._course;
                this.fireFilterChangedEvent();
            });
            console.log("did render");
            this._alreadyRendered = true;

            console.log(groupLetterSelect);
            if (localStorage.groupLetter != null) {
                this._groupLetter = localStorage.groupLetter;
                groupLetterSelect.value = this._groupLetter;
            }
            if (localStorage.group == "true") {
                this._group = true;
                filterByGroupButton.checked = true;
            }
            if (localStorage.qdl == "true") {
                this._qdl = true;
                qdlButton.checked = true;
            }

            coursesSelelct.addEventListener("change", event => this.feedChanged(event));
            groupLetterSelect.addEventListener("change", event => this.filterChangedHandler(event, "_groupLetter", "value"));
            qdlButton.addEventListener("change", event => this.filterChangedHandler(event, "_qdl"));
            filterByGroupButton.addEventListener("change", event => this.filterChangedHandler(event, "_group"));
            $$(this, "stundenplan-impressum").addEventListener("close", event => this.hideShowImpressum(event)); 
        }
    }

    renderCourseList(course) {
        if (course.semester !== null) {
            return course.semester.map(semester => html`<option value="${course.courseOfStudy} ${semester}">${course.name} ${semester}</option>`);
        }
        return html`<option value="${course.courseOfStudy} 0" > ${course.name}</option>`;
    }
    filterChanged() {
        if (this._course !== undefined && this._groupLetter !== undefined) {
            localStorage.groupLetter = this._groupLetter;
            localStorage.qdl = this._qdl;
            localStorage.group = this._group;
            this.fireFilterChangedEvent();
        }
    }
    fireFilterChangedEvent(){
        this.dispatchEvent(new CustomEvent("filter", {
            detail: {
                group: this._group,
                qdl: this._qdl,
                groupLetter: this._groupLetter
            }
        }));
    }
    feedChanged(event) {
        console.log("feed changed");
        this._course = event.target.value;
        localStorage.course = this._course;
        this.dispatchEvent(new CustomEvent("feed", {
            detail: {
                course: this._course
            }
        }));
    }
    close() {
        this.dispatchEvent(new CustomEvent("close"));
    }
    reset() {
        console.log("lll");
        this.dispatchEvent(new CustomEvent("reset"));
    }
    hideShowImpressum(event) {
        console.log(this.impressumVisible);
        this.impressumVisible = !this.impressumVisible;
        if (this.impressumVisible) {
            $$(this, "#settings").style.display = "none";
            $$(this, "stundenplan-impressum").style.display = "block"
        } else {
            $$(this, "#settings").style.display = "block";
            $$(this, "stundenplan-impressum").style.display = "none";
        }
    }
    filterChangedHandler(event, propName, eventAttribute = "checked", context = this) {
        context[propName] = event.target[eventAttribute];
        this.filterChanged();
    }
}
window.customElements.define(StundenplanSettings.is, StundenplanSettings);
