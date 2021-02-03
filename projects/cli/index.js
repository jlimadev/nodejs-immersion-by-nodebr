const { program } = require('commander');
const Hero = require('./Hero');
const Database = require('./database');

(async () => {
  /**
   * node cli.js --help
   */
  program
    .version('v1')
    .option('-n, --name [value]', 'add name')
    .option('-p, --power [value]', 'add power')
    //CRUD
    .option('-a, --add', 'register hero')
    .option('-g, --get [value]', 'get hero by id', false)
    .option('-u, --update [value]', 'update hero by id')
    .option('-d, --delete [value]', 'delete hero by id')
    .parse(process.argv);

  const options = program.opts();
  const hero = new Hero(options);
  try {
    /**
     * node cli.js --add params...
     * node cli.js -a -n Hulk -p Forca
     */
    if (options.add) {
      await Database.add(hero);
      console.log('Successfully added hero!');
      return;
    }

    /**
     * node cli.js --get
     * node cli.js -g
     * node cli.js -g 1
     */
    if (options.get) {
      const id = options.get;
      console.log(id);
      const result = await Database.get(id);
      console.log(result);
      return;
    }

    /**
     * node cli.js --update
     * node cli.js -u 1 -n papa
     * node cli.js -u 1 -n thor -p trovao
     */
    if (options.update) {
      const id = options.update;
      console.log('id', id);
      await Database.update(id, hero);
      console.log('Successfully updated hero!');
      return;
    }
    /**
     * node cli.js --delete
     * node cli.js -d 1
     */
    if (options.delete) {
      const id = options.delete;
      await Database.delete(id);
      console.log('Successfully deleted hero!');
      return;
    }
  } catch (error) {
    console.error('OPS', error);
    return;
  }
})();
