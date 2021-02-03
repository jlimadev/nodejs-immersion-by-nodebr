const { getPersons } = require('./service');

const main = async () => {
  try {
    const { results } = await getPersons('a');
    const heights = results.map((person) => parseInt(person.height));
    const totalHeight = heights.reduce((previous, current) => {
      return previous + current;
    }, 100);

    console.log(heights);
    console.log(totalHeight);
  } catch (error) {
    console.error('Ops!', error);
  }
};

main();
