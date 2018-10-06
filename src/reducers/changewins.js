
import { CHANGEWINS } from '../actions/changewins.js';

const changewins = (state = {wins: 0}, action) => {
  switch (action.type) {
    case CHANGEWINS:
      return {
        ...state,
        wins: action.wins
      };
    default:
      return state;
  }
};

export default changewins;