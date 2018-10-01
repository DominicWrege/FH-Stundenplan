import { LitElement, html } from '@polymer/lit-element';

class CardElement extends LitElement {
  _render({}) {
    //${FabStyles}
    return html`
        <style>
            :host {
                display: block;
                background: white;
            }
        </style>
        <slot></slot>
    `;
  }
    static get is(){return "card-element"};
}
window.customElements.define(CardElement.is, CardElement);

// <!-- box-shadow: 0 3px 4px 0 rgba(0, 0, 0, 0.14),
// 0 1px 8px 0 rgba(0, 0, 0, 0.12),
// 0 3px 3px -2px rgba(0, 0, 0, 0.4);  border-radius: 1px;