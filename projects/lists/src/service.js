const axios = require('axios');
const baseURL = 'https://swapi.dev/api/people';

const getPersons = async (name) => {
  const url = `${baseURL}/?search=${name}&format=json`;
  const response = await axios.get(url);

  if (!response.data) {
    throw new Error('Could not get this persons');
  }

  return response.data;
};

module.exports = { getPersons };
