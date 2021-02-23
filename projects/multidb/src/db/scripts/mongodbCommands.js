/**
 *  docker ps (get the image name or id)
 *
 * docker exec -it 2ba562bd247c \
 * mongo -u jlimadev -p secretpass --authenticationDatabase heroes
 * */

/**
 * Commands
 * show dbs --> Show all databases
 * use 'db' --> Will switch to the choosen database
 * show collections --> show collections (like tables)
 */

/**
 * CREATE
 * insert data into a collection
 * Using JS Commands
 */

// Insert one item
db.heroes.insert({
  name: 'John Doe',
  power: 'Foo',
});

// insert multiple item (in loops)
for (let i = 0; i <= 10; i++) {
  db.heroes.insert({
    name: `John Doe [${i}]`,
    power: 'Foo',
  });
}

/**
 * READ
 * find data
 * count data
 * */

db.heroes.find();
db.heroes.findOne();
db.heroes.find().pretty();
db.heroes.find().limit(2).sort({ name: -1 }).pretty(); // sort desc
db.heroes.find().limit(2).sort({ name: 1 }).pretty(); // sort asc
db.heroes.find({ name: 'John Doe' }); // query by field
db.heroes.find({}, { power: 1, _id: 0 }); // bring all (no query), but only the power field (no ID)
db.heroes.count();

/**
 * UPDATE
 * first param query to match the
 * second param body
 * by default updates only the first match
 */

db.heroes.update(
  { _id: ObjectId('601e8b4b1f22da0a6929060a') },
  { $set: { name: 'Bomuto' } },
); // will update only the named field

db.heroes.update(
  { _id: ObjectId('601e8b4b1f22da0a6929060a') },
  { $set: { stocks: 'FB' } },
); // will create a new field if not exists

db.heroes.update(
  { _id: ObjectId('601e89b81f22da0a69290600') },
  { name: 'João Douglas' },
); // will replace the object with only this name field (no power field anymore)

/**
 * DELETE
 * remove registers from database
 */
db.heroes.remove({}); // remove every registered
db.heroes.remove({ name: 'João Douglas' });
