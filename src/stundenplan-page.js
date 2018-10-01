
import { LitElement } from '@polymer/lit-element';

export class StundenplanPage extends LitElement {
  _shouldRender(props, changedProps, old) {
    return props.active;
  }

  static get properties() {
    return {
      active: Boolean
    }
  }
}