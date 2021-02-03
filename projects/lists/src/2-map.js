const service = require('./service');

const main = async () => {
  try {
    const result = await service.getPersons('a');
    const { results } = result;
    const names = results.map((person) => person.name);
    console.log(names);
  } catch (err) {
    console.error(err);
  }
};

main();
