const { tables } = require("..");

module.exports = {
  seed: async (knex) => {
    // first delete all entries
    await knex(tables.beer).delete();

    // then add the fresh beers
    await knex(tables.beer).insert([
      {
        id: "7f28c5f9-d711-4cd6-ac15-d13d71abbe01",
        name: "Carlsberg",
        percentage: 5.5,
        brewery_id: "7f28c5f9-d711-4cd6-ac15-d13d71abbr01",
      },
      {
        id: "7f28c5f9-d711-4cd6-ac15-d13d71abbe02",
        name: "Tripel Karmeliet",
        percentage: 8.4,
        brewery_id: "7f28c5f9-d711-4cd6-ac15-d13d71abbr02",
      },
      {
        id: "7f28c5f9-d711-4cd6-ac15-d13d71abbe03",
        name: "Westmalle Dubbel",
        percentage: 7,
        brewery_id: "7f28c5f9-d711-4cd6-ac15-d13d71abbr03",
      },
    ]);
  },
};
