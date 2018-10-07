import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { connect } from 'pwa-helpers/connect-mixin.js';
import { changecountry } from '../actions/changecountry';
import { changewins } from '../actions/changewins';
import { addgraphdata } from '../actions/addgraphdata';
import { store } from '../store';
import * as d3 from "d3";
import { scaleOrdinal } from "d3-scale";
import { arc as d3Arc, pie as d3Pie } from "d3-shape";
import '../shared-styles.js';

class Donut extends connect(store)(PolymerElement) {

	constructor() {
		super();

		this.dataGraph = store.getState().addgraphdata;
		this.value = store.getState().changetitle.title;
		this.country = store.getState().changecountry.country;
		this.wins = store.getState().changewins.wins;
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
		this.getData();
	}
	getData(newData) {
		if (newData) {
			this.setGraph(newData);
		} else {
			this.setGraph(this.dataGraph);
		}
	}
	addCountry() {
		if(!this.country || !this.wins) return;
		let res = {
			"team": this.country,
			"wins": this.wins
		}
		this.dataGraph = [...this.dataGraph, store.dispatch(addgraphdata(res)).addgraphdata];
		this.setGraph(this.dataGraph);
		this.country = '';
		this.wins = null;
	}
	removeCountry() {
    if(!this.country) return;
		let newData = this.dataGraph.filter( el => el.team !== this.country );
		this.setGraph(newData);
  }
	setGraph(graphData) {
		let width = this.width,
			height = this.height,
			radius = Math.min(width, height) / 2;

		let color = scaleOrdinal(d3.schemeSet3)

		let arc = d3.arc()
			.outerRadius(radius - 10)
			.innerRadius(radius - 70);

		let pie = d3.pie()
			.sort(null)
			.value(function (d) { return d.wins; });

		const svgroot = this.shadowRoot.querySelector('#chart-area')
		d3.select(svgroot).selectAll("svg").remove();
		let svg = d3.select(svgroot).append("svg")
			.attr("width", width)
			.attr("height", height)
			.append("g")
			.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

		let g = svg.selectAll(".arc")
			.data(pie(graphData))
			.enter().append("g")
			.attr("class", "arc");

		g.append("path")
			.attr("d", arc)
			.style("fill", function (d) { return color(d.data.team); });

		g.append("text")
			.attr("transform", function (d) { return "translate(" + arc.centroid(d) + ")"; })
			.attr("dy", ".35em")
			.text(function (d) { return d.data.team; });

	}
	changeCountry(string) {
		this.country = store.dispatch(changecountry(string)).country;
	}
	changeWins(string) {
		this.wins = Number(store.dispatch(changewins(string)).wins);
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
			.btn {
				background: greenyellow;
				height: 40px;
    		border: none;
    		border-radius: 6px;
				margin: 4px;
				outline:none;
				font-weight: bold;
				font-size: 13px;
				width: 100px;
			}
			.btn:hover {
				background: #000;
				color: #fff;
				cursor: pointer;
			}
			.primary {
				background: tomato;
			}
			input {
				height: 33px;
    		outline: none;
    		line-height: 30px;
    		font-size: 14px;
				margin: 2px;
				padding: 0 10px;
			}
			.flex {
				display: flex;
				flex-flow: row;
				align-items: center;
				justify-content: center;
			}
		</style>

			<div class="card">
				<div id="chart-area">
     
				</div>
				<div class="flex">
					<input type="text" placeholder="Add Country" value="{{countryString::input}}"/>
					<input type="number" placeholder="Add Wins" value="{{winsString::input}}"/>
					<button class="btn" on-click="addCountry">Add</button>
					<button class="btn primary" on-click="removeCountry">Remove</button>
				</div>
				<p>{{changeWins(winsString)}} {{ country }} {{ wins }} {{changeCountry(countryString)}}</p>
			</div>
    `;
	}


	// This is called every time something is updated in the store.
	_stateChanged(state) {
		this._title = state.changetitle.title;
		this._country = state.changecountry.country;
		this._wins = state.changewins.wins;
		this._dataGraph = state.addgraphdata.addgraphdata
	}

}

window.customElements.define('my-donut', Donut);
