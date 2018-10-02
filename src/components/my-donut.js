import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { connect } from 'pwa-helpers/connect-mixin.js';
import { store } from '../store';
import * as d3 from "d3";
import { scaleOrdinal } from "d3-scale";
import { arc as d3Arc, pie as d3Pie } from "d3-shape";
import '../shared-styles.js';

class Donut extends connect(store)(PolymerElement) {

	constructor() {
		super();

		this.value = store.getState().changetitle.title;
	}
	static get properties() {
		return {
			width: {
				type: Number
			},
			height: {
				type: Number
			}
		}
	}
	ready() {
		super.ready();
		this.setGraph();
	}
	setGraph() {
		let width = 960,
			height = 500,
			radius = Math.min(width, height) / 2;

		let color = scaleOrdinal(d3.schemeSet3)

		let arc = d3.arc()
			.outerRadius(radius - 10)
			.innerRadius(radius - 70);

		let pie = d3.pie()
			.sort(null)
			.value(function (d) { return d.population; });

		const svgroot = this.shadowRoot.querySelector('#chart-area')
		let svg = d3.select(svgroot).append("svg")
			.attr("width", width)
			.attr("height", height)
			.append("g")
			.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

			d3.json("data.json").then(data => {

			let g = svg.selectAll(".arc")
				.data(pie(data))
				.enter().append("g")
				.attr("class", "arc");

			g.append("path")
				.attr("d", arc)
				.style("fill", function (d) { return color(d.data.age); });

			g.append("text")
				.attr("transform", function (d) { return "translate(" + arc.centroid(d) + ")"; })
				.attr("dy", ".35em")
				.text(function (d) { return d.data.age; });
		});

		function type(d) {
			d.population = +d.population;
			return d;
		}
	}

	static get template() {
		return html`
		<style>
			#chart-area svg {
				margin:auto;
				display:inherit;
			}
			svg {
				display:flex;
			}
			.card {
        margin: 24px;
        padding: 16px;
        color: #757575;
        border-radius: 5px;
        background-color: #fff;
        box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2);
      }
			.arc text {
				font: 10px sans-serif;
				text-anchor: middle;
			}
			
			.arc path {
				stroke: #fff;
			}
		</style>

			<div class="card">
				<div id="chart-area">
     
				</div>
			</div>
    `;
	}


	// This is called every time something is updated in the store.
	_stateChanged(state) {
		this._title = state.changetitle.title;
	}

}

window.customElements.define('my-donut', Donut);
