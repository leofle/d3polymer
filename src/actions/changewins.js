
export const CHANGEWINS = 'CHANGEWINS';

export const changewins = (wins) => {
  return {
    type: CHANGEWINS,
    wins
  };
};