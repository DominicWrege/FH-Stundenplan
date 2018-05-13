class StundenplanFetcher extends Polymer.Element {

    static get is() {
        return "stundenplan-fetcher";
    }

    static get properties() {
        return {
            response: {
                type: Object,
                notify: true
            },    
            feedEventsUrl: String
        };
    }

    constructor() {
        super();
    }

    ready() {
        super.ready();
        // Polymer.RenderStatus.afterNextRender(this, function() {
            
        // });
    }

}

window.customElements.define(StundenplanFetcher.is, StundenplanFetcher);