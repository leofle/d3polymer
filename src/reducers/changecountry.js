
import { CHANGECOUNTRY } from '../actions/changecountry.js';

const changecountry = (state = {country: ''}, action) => {
  switch (action.type) {
    case CHANGECOUNTRY:
      return { ...state, country: action.title };
    default:
      return state;
  }
};

export default changecountry;