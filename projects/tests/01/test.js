const assert = require('assert');
const nock = require('nock');
const { getPersons, baseURL } = require('./service');

describe('Star Wars Tests', () => {
  before(() => {
    const mockedResponse = {
      count: 1,
      next: null,
      previous: null,
      results: [
        {
          birth_year: '33BBY',
          created: '2014-12-10T15:11:50.376000Z',
          edited: '2014-12-20T21:17:50.311000Z',
          eye_color: 'red',
          films: [
            'http://swapi.dev/api/films/1/',
            'http://swapi.dev/api/films/2/',
            'http://swapi.dev/api/films/3/',
            'http://swapi.dev/api/films/4/',
            'http://swapi.dev/api/films/5/',
            'http://swapi.dev/api/films/6/',
          ],
          gender: 'n/a',
          hair_color: 'n/a',
          height: '96',
          homeworld: 'http://swapi.dev/api/planets/8/',
          mass: '32',
          name: 'R2-D2',
          skin_color: 'white, blue',
          species: ['http://swapi.dev/api/species/2/'],
          starships: [],
          url: 'http://swapi.dev/api/people/3/',
          vehicles: [],
        },
      ],
    };

    nock(baseURL).get('/?search=R2-D2&format=json').reply(200, mockedResponse);
  });
  it('Should search R2D2 with correct format', async () => {
    const expectedResponse = [{ name: 'R2-D2', height: '96' }];
    const baseName = 'R2-D2';

    const response = await getPersons(baseName);
    assert.deepStrictEqual(response, expectedResponse);
  });
});
