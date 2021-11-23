const { tables } = require("..");

module.exports = {
  up: async (knex) => {
    await knex.schema.createTable(tables.beer, (table) => {
      table.uuid("id").primary();

      table.string("name", 255).notNullable();

      // table.integer("percentage").notNullable();

      // table.uuid("brewery_id").notNullable();

      // table
      //   .foreign("brewery_id", "fk_beer_brewery")
      //   .references(`${tables.brewery}.id`)
      //   .onDelete("CASCADE");

      // Give this unique index a name for better error handling in service layer
      table.unique("name", "idx_beer_name_unique");
    });
  },
  down: (knex) => {
    return knex.schema.dropTableIfExists(tables.beer);
  },
};
