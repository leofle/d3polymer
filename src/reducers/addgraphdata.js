
import { ADDGRAPHDATA } from '../actions/addgraphdata.js';

let initialState = [
	{
    "team": "brazil",
    "wins": 5
  },
  {
    "team": "germany",
    "wins": 4
  },
  {
    "team": "italy",
    "wins": 4
  },
  {
    "team": "argentina",
    "wins": 2
  },
  {
    "team": "france",
    "wins": 2
  },
  {
    "team": "uruguay",
    "wins": 2
  },
  {
    "team": "england",
    "wins": 1
	},
	{
    "team": "spain",
    "wins": 1
  }
]
const addgraphdata = (state, action) => {
	console.log(state,action)
  switch (action.type) {
    case ADDGRAPHDATA:
      return [...state, action.addgraphdata] ;
    default:
      return initialState;
  }
};

export default addgraphdata;