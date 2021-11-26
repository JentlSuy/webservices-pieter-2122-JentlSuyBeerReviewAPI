const { tables } = require("..");

module.exports = {
  seed: async (knex) => {
    // first delete all entries
    await knex(tables.brewery).delete();

    // then add the fresh breweries
    await knex(tables.brewery).insert([
      {
        id: "7f28c5f9-d711-4cd6-ac15-d13d71abbr01",
        name: "Carlsberg Group",
        country: "Denmark",
      },
      {
        id: "7f28c5f9-d711-4cd6-ac15-d13d71abbr02",
        name: "Brouwerij Bosteels",
        country: "Belgium",
      },
      {
        id: "7f28c5f9-d711-4cd6-ac15-d13d71abbr03",
        name: "Abdij van Westmalle",
        country: "Belgium",
      },
    ]);
  },
};
