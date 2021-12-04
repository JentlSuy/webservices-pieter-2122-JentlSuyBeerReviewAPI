const { tables } = require("..");

module.exports = {
  up: async (knex) => {
    await knex.schema.alterTable(tables.beer, (table) => {
      table.double("percentage")
        .nullable();
    });
  },
  down: (knex) => {
    return knex.schema.alterTable(tables.beer, (table) => {
      table.dropColumn("percentage");
    });
  },
};
