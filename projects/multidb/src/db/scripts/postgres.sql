-- GENERATE UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
SELECT uuid_generate_v4();

-- DELETE TABLE
DROP TABLE IF EXISTS TB_HEROES;

-- CREATE TABLE
CREATE TABLE TB_HEROES( 
  ID UUID DEFAULT uuid_generate_v4() NOT NULL PRIMARY KEY,
  NAME TEXT NOT NULL,
  POWER TEXT NOT NULL
)

-- INSERT ITEM
INSERT INTO TB_HEROES (NAME, POWER) 
VALUES 
  ('Flash', 'Speed'), 
  ('Nainha', 'Tureca'), 
  ('Bomuto', 'Tabecao');

  -- GET ITEMS
SELECT * FROM TB_HEROES;
SELECT * FROM TB_HEROES WHERE ID = 'ANY';
SELECT * FROM TB_HEROES WHERE NAME = 'ANY';
SELECT * FROM TB_HEROES WHERE POWER = 'ANY';

  -- UPDATE ITEMS
UPDATE TB_HEROES SET NAME = 'Mayu', POWER = 'Eat Cake' WHERE NAME = 'Flash'

-- DELETE ITEMS
DELETE FROM TB_HEROES WHERE ID = 'ANY';