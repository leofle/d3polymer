import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '../shared-styles.js';

class Nodes extends PolymerElement {
  static get template() {
    return html`
			<g class="nodes"></g>
    `;
  }
}

window.customElements.define('app-nodes', Nodes);
