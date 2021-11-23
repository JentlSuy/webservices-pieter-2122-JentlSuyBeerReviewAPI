const { tables } = require("..");

module.exports = {
  up: async (knex) => {
    await knex.schema.createTable(tables.review, (table) => {
      table.uuid("id").primary();

      table.integer("rating").notNullable();

      table.string("description", 255).notNullable();

      table.dateTime("date").notNullable();

      table.uuid("user_id").notNullable();

      // Give this foreign key a name for better error handling in service layer
      table
        .foreign("user_id", "fk_review_user")
        .references(`${tables.user}.id`)
        .onDelete("CASCADE");

      table.uuid("beer_id").notNullable();

      // Give this foreign key a name for better error handling in service layer
      table
        .foreign("beer_id", "fk_review_beer")
        .references(`${tables.beer}.id`)
        .onDelete("CASCADE");
    });
  },
  down: (knex) => {
    return knex.schema.dropTableIfExists(tables.review);
  },
};
