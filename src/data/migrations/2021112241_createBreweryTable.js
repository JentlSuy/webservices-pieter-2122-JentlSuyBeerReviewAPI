const { tables } = require("..");

module.exports = {
  up: async (knex) => {
    await knex.schema.createTable(tables.brewery, (table) => {
      table.uuid("id").primary();

      table.string("name", 255).notNullable();

      table.string("country", 255).notNullable();

      // Give this unique index a name for better error handling in service layer
      table.unique("name", "idx_brewery_name_unique");
    });
  },
  down: (knex) => {
    return knex.schema.dropTableIfExists(tables.brewery);
  },
};
