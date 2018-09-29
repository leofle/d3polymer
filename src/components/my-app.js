/**
 * @license
 * Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { setPassiveTouchGestures, setRootPath } from '@polymer/polymer/lib/utils/settings.js';
import { connect } from 'pwa-helpers/connect-mixin.js';
import { installRouter } from 'pwa-helpers/router.js';
import '@polymer/app-layout/app-drawer/app-drawer.js';
import '@polymer/app-layout/app-drawer-layout/app-drawer-layout.js';
import '@polymer/app-layout/app-header/app-header.js';
import '@polymer/app-layout/app-header-layout/app-header-layout.js';
import '@polymer/app-layout/app-scroll-effects/app-scroll-effects.js';
import '@polymer/app-layout/app-toolbar/app-toolbar.js';
import '@polymer/app-route/app-location.js';
import '@polymer/app-route/app-route.js';
import '@polymer/iron-pages/iron-pages.js';
import '@polymer/iron-selector/iron-selector.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import './my-icons.js';
import { store } from '../store.js';
// Gesture events like tap and track generated from touch will not be
// preventable, allowing for better scrolling performance.
setPassiveTouchGestures(true);

// Set Polymer's root path to the same value we passed to our service worker
// in `index.html`.
setRootPath(MyAppGlobals.rootPath);
class MyApp extends connect(store)(PolymerElement) {
  constructor(){
    super();

    this.title = store.title;
    this.width = window.innerWidth;
    this.height = window.innerHeight;
  }
  
  static get template() {
    return html`
      <style>
        :host {
          --app-primary-color: #FFFFFF;
          --app-secondary-color: black;
          --heder-height: 65px;
          font-family: 'Avenir', Helvetica, Arial, sans-serif;
          -webkit-font-smoothing: antialiased;
          display: block;
        }

        app-drawer-layout:not([narrow]) [drawer-toggle] {
          display: none;
        }
        app-toolbar {
          display: flex;
          justify-content: center;
          height: 100%;
        }
        app-header {
          color: #000;
          background-color: var(--app-primary-color);
          height: var(--heder-height);
          box-shadow: 4px 0px 15px #ccc;
        }

        app-header paper-icon-button {
          --paper-icon-button-ink-color: white;
        }
        .drawer-list {
          margin: 0 20px;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .drawer-list a {
          display: block;
          padding: 10px;
          text-decoration: none;
          color: var(--app-secondary-color);
          font-size: 16px;
          position: relative;
        }

        .drawer-list a.iron-selected {
          color: black;
        }

        .drawer-list a.iron-selected:before, .drawer-list a:hover:before {
          content:'';
          position:absolute;
          bottom:-3px;
          left:0;
          width:100%;
          height:4px;
          background: #000;
        }
      </style>

      <app-location route="{{route}}" url-space-regex="^[[rootPath]]">
      </app-location>

      <app-route route="{{route}}" pattern="[[rootPath]]:page" data="{{routeData}}" tail="{{subroute}}">
      </app-route>

      <app-drawer-layout fullbleed="" narrow="{{narrow}}">

        <!-- Main content -->
        <app-header-layout has-scrolling-region="">

          <app-header slot="header" condenses="" reveals="" effects="waterfall">
            <app-toolbar>
              <iron-selector selected="[[page]]" attr-for-selected="name" class="drawer-list" role="navigation">
              <a name="home" href="[[rootPath]]home">Home</a>
              <a name="graphsvg" href="[[rootPath]]graphsvg">GraphSvg</a>
              </iron-selector>
            </app-toolbar>
          </app-header>

          <iron-pages selected="[[page]]" attr-for-selected="name" role="main">
            <my-home name="home" title="[[ title ]]"></my-home>
            <my-graph name="graphsvg" width=[[width]] height=[[height]]></my-graph>
            <my-view404 name="view404"></my-view404>
          </iron-pages>
        </app-header-layout>
      </app-drawer-layout>
    `;
  }

  static get properties() {
    return {
      page: {
        type: String,
        reflectToAttribute: true,
        observer: '_pageChanged'
      },
      title: {type: String},
      _page: { type: String },
      routeData: Object,
      subroute: Object
    };
  }

  static get observers() {
    return [
      '_routePageChanged(routeData.page)'
    ];
  }

  _routePageChanged(page) {
     // Show the corresponding page according to the route.
     //
     // If no page was found in the route data, page will be an empty string.
     // Show 'view1' in that case. And if the page doesn't exist, show 'view404'.
    if (!page) {
      this.page = 'home';
    } else if (['home', 'graphsvg'].indexOf(page) !== -1) {
      this.page = page;
    } else {
      this.page = 'view404';
    }

    // Close a non-persistent drawer when the page & route are changed.
    // if (!this.$.drawer.persistent) {
    //   this.$.drawer.close();
    // }
  }

  _pageChanged(page) {
    // Import the page component on demand.
    //
    // Note: `polymer build` doesn't like string concatenation in the import
    // statement, so break it up.
    switch (page) {
      case 'home':
        import('./my-home.js');
        break;
      case 'graphsvg':
        import('./my-graph.js');
        break;
      case 'view404':
        import('./my-view404.js');
        break;
    }
  }

  firstUpdated() {
    installRouter((location) => store.dispatch(navigate(window.decodeURIComponent(location.pathname))));
  }

  updated(changedProps) {
    if (changedProps.has('_page')) {
      const pageTitle = this.appTitle + ' - ' + this._page;
      updateMetadata({
        title: pageTitle,
        description: pageTitle
        // This object also takes an image property, that points to an img src.
      });
    }
  }

  _stateChanged(state) {
    this._page = state.app.page;
  }
}

window.customElements.define('my-app', MyApp);
