const { get } = require('axios');
const baseURL = 'https://swapi.dev/api/people';

const getPersons = async (baseName) => {
  try {
    const apiURL = `${baseURL}/?search=${baseName}&format=json`;
    const response = await get(apiURL);
    console.log(response);

    if (!response.data || response.data.results.length === 0) {
      throw new Error('Could not get this persons');
    }

    return response.data.results.map(mapPersons);
  } catch (error) {
    console.error(error);
  }
};

const mapPersons = (person) => {
  return {
    name: person.name,
    height: person.height,
  };
};

module.exports = { getPersons, baseURL };
