const { getPersons } = require('./service');

const main = async () => {
  try {
    const { results } = await getPersons('a');
    const namesFor = [];
    const namesForIn = [];
    const namesForOf = [];
    const namesForEach = [];

    /* Using for loop - works with index */
    for (let i = 0; i <= results.length - 1; i++) {
      const person = results[i];
      namesFor.push(person.name);
    }
    console.log('For', namesFor);

    /* Using for in option - also works with index*/
    for (let i in results) {
      const person = results[i];
      namesForIn.push(person.name);
    }
    console.log('For In', namesForIn);

    /* using for of - returns the content of the array (one by one) */
    for (person of results) {
      namesForOf.push(person.name);
    }
    console.log('For Of', namesForOf);

    /* Using for each loop  */
    results.forEach((person) => {
      namesForEach.push(person.name);
    });
    console.log('For Each', namesForEach);
  } catch (err) {
    console.error('Internal Error', err);
  }
};

main();
