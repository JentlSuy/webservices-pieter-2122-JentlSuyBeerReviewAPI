const { tables } = require("..");

module.exports = {
  seed: async (knex) => {
    // first delete all entries in every table
    await knex(tables.review).delete();
    await knex(tables.beer).delete();
    // await knex(tables.brewery).delete();
    await knex(tables.user).delete();
  },
};
