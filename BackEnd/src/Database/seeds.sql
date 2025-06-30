INSERT INTO users (first_name, last_name, email, password_digest, code)
  VALUES('Professor', 'X', 'professor-x@gmail.com', '$2b$10$0hJb0QHBSwn7eKhgXXZMVOoXmJvQM4Bj70Z6PDpf0M79oHwG..6nW', '0101');
  -- Password is: Xmen.1234

INSERT INTO users (first_name, last_name, email, password_digest, code)
  VALUES('Master', 'Yoda', 'master-yoda@gmail.com', '$2b$10$k2OJQZsF9byuzyVlZkwesucdCqDQMVpUm3xotMAGxh030L5Srvl/K', '0110');
  -- Password is: Starwars.1234INSERT INTO superheroes (superhero_name, user_id)
  VALUES('captain_obvious', 1);
INSERT INTO superheroes (superhero_name, user_id)
  VALUES('wolverine', 1);
INSERT INTO superheroes (superhero_name, user_id)
  VALUES('hulk', 1);
INSERT INTO superheroes (superhero_name, user_id)
  VALUES('obi-wan kenobi', 2);
INSERT INTO superheroes (superhero_name, user_id)
  VALUES('han solo', 2);
INSERT INTO superheroes (superhero_name, user_id)
  VALUES('anakin skywalker', 2);INSERT INTO tasks (superpower, superhero_id)
  VALUES('Wash Dishes', 1);
INSERT INTO tasks (superpower, superhero_id)
  VALUES('Vacuum the house', 1);

INSERT INTO tasks (superpower, superhero_id)
  VALUES('Scrub the floor', 2);
INSERT INTO tasks (superpower, superhero_id)
  VALUES('Clean the garage', 2);
INSERT INTO tasks (superpower, superhero_id)
  VALUES('Cook lunch', 2);

INSERT INTO tasks (superpower, superhero_id)
  VALUES('Bake chocolate cake', 4);
INSERT INTO tasks (superpower, superhero_id)
  VALUES('Cook dinner', 4);
INSERT INTO tasks (superpower, superhero_id)
  VALUES('Fold laundry', 4);
INSERT INTO tasks (superpower, superhero_id)
  VALUES('Wipe the table', 4);

INSERT INTO tasks (superpower, superhero_id)
  VALUES('Take out the thrash', 6);
INSERT INTO tasks (superpower, superhero_id)
  VALUES('Clean the pool', 6);
INSERT INTO tasks (superpower, superhero_id)
  VALUES('Organize the backyard tools', 6);
