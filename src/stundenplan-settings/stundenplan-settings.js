class StundenplanSettings extends Polymer.Element {
	static get is() { return "stundenplan-settings"; }
	static get properties() {
		return {
			_allGroupLetters: {
				type: Array,
				value: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K",
					"L", "M", "N", "O", "P", "Q", "L", "R", "S", "T", "U",
					"V", "W", "Y", "Z"]
			},
			course: {
				type: String,
				observer: "feedChanged"
			},
			groupLetter: {
				type: String,
				observer: "filterChanged"
			},
			courses: {
				type: Array
			},
			qdl: {
				type: Boolean,
				value: false,
				observer: "filterChanged"
			},
			group: {
				type: Boolean,
				value: false,
				observer: "filterChanged"
			},
			url: {
				type: String,
			}
		}
	};
	constructor() {
		super();
		if (localStorage.course != null)
			this.course = localStorage.course;

		if (localStorage.groupLetter != null)
			this.groupLetter = localStorage.groupLetter;

		if (localStorage.group == "true") {
			this.group = true;
		}
		if (localStorage.qdl == "true") {
			this.qdl = true;
		}

	}
	filterChanged() {
		if (this.course != null && this.groupLetter != null) {
			localStorage.groupLetter = this.groupLetter;
			localStorage.qdl = this.qdl;
			localStorage.group = this.group;
			this.dispatchEvent(new CustomEvent('filter', {
				detail: {
					group: this.group,
					qdl: this.qdl,
					groupLetter: this.groupLetter
				}
			}
			));
		}
	}
	feedChanged() {
		if (this.course != null) {
			localStorage.course = this.course;
			this.dispatchEvent(new CustomEvent('feed', {
				detail: {
					course: this.course
				}
			}
			));
		}
	}
	handleResponse(data) {
		if (data != null) {
			let arrValues = Object.values(data);
			let arrKeys = Object.keys(data);
			for (let i in arrValues)
				arrValues[i].key = arrKeys[i];
			return arrValues;
		}
	}

}
window.customElements.define(StundenplanSettings.is, StundenplanSettings);