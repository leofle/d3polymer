import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '../shared-styles.js';

class Links extends PolymerElement {
  static get template() {
    return html`
			<g class="links"></g>
    `;
  }
}

window.customElements.define('app-links', Links);
