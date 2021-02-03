const { getPersons } = require('./service');

const main = async () => {
  const { results } = await getPersons('a');
  const nameToFind = 'skywalker';

  const callbackFunction = (person) =>
    person.name.toLowerCase().indexOf(nameToFind) !== -1;

  const filterResult = results.filter(callbackFunction);

  if (!filterResult || filterResult.length === 0) {
    throw new Error('[Not Found] - Could not find members of this family');
  }

  const names = filterResult.map((person) => person.name);

  console.log(names);
  try {
  } catch (error) {
    console.error(error);
  }
};

main();
