const { tables } = require("..");

module.exports = {
  seed: async (knex) => {
    // first delete all entries
    await knex(tables.user).delete();

    // then add the fresh users (all passwords are 12345678)
    await knex(tables.user).insert([
      {
        id: "7f28c5f9-d711-4cd6-ac15-d13d71abus01",
        name: "Jentl Suy",
        email: "suy.jentl@student.hogent.be",
      },
      {
        id: "7f28c5f9-d711-4cd6-ac15-d13d71abus02",
        name: "Glenn De Bock",
        email: "gdb@gmail.com",
      },
      {
        id: "7f28c5f9-d711-4cd6-ac15-d13d71abus03",
        name: "Baue Joris",
        email: "baue2002@gmail.com",
      },
    ]);
  },
};
