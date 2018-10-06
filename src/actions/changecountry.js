
export const CHANGECOUNTRY = 'CHANGECOUNTRY';

export const changecountry = (country) => {
  return {
    type: CHANGECOUNTRY,
    country
  };
};