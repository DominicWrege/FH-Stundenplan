import { LitElement, html } from '@polymer/lit-element';
class StundenplanImpressum extends LitElement {
    _render() {
        return html`
        <style>
            :host {
                display: block
            }
            div{
                text-align: center;
                margin-bottom: 16px;
            }
        </style>
        <h2>Impressum</h2>
        <div>
            <p>Dominic Wrege</p>
            <p>Combrinkstr.8</p>
            <p>59229 Ahlen</p>
            <p>wrege@domi-me.de</p>
            <p>02388/3701</p>
        </div>
        <mwc-button on-click="${() => this.dispatchEvent(new CustomEvent("close", {}))}">Zurück</mwc-button>`;
    }

    static get is() {
        return "stundenplan-impressum";
    }
}

window.customElements.define(StundenplanImpressum.is, StundenplanImpressum);
