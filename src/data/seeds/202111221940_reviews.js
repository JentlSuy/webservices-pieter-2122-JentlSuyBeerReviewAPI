const { tables } = require("..");

module.exports = {
  seed: async (knex) => {
    // first delete all entries
    await knex(tables.review).delete();

    // then add the fresh users
    await knex(tables.review).insert([
      {
        // User Jentl
        id: "7f28c5f9-d711-4cd6-ac15-d13d71abre01",
        user_id: "7f28c5f9-d711-4cd6-ac15-d13d71abus01",
        beer_id: "7f28c5f9-d711-4cd6-ac15-d13d71abbe03",
        rating: 4,
        description: "Lekker biertje",
        date: new Date(2021, 4, 25, 19, 40),
      },
      {
        id: "7f28c5f9-d711-4cd6-ac15-d13d71abre02",
        user_id: "7f28c5f9-d711-4cd6-ac15-d13d71abus01",
        beer_id: "7f28c5f9-d711-4cd6-ac15-d13d71abbe04",
        rating: 3,
        description: "Goed",
        date: new Date(2021, 4, 8, 20, 0),
      },
      {
        id: "7f28c5f9-d711-4cd6-ac15-d13d71abre03",
        user_id: "7f28c5f9-d711-4cd6-ac15-d13d71abus01",
        beer_id: "7f28c5f9-d711-4cd6-ac15-d13d71abbe05",
        rating: 5,
        description: "Ik hou van Westmalle Dubbel!",
        date: new Date(2021, 4, 8, 20, 0),
      },
      {
        // User Glenn
        id: "7f28c5f9-d711-4cd6-ac15-d13d71abre04",
        user_id: "7f28c5f9-d711-4cd6-ac15-d13d71abus02",
        beer_id: "7f28c5f9-d711-4cd6-ac15-d13d71abbe05",
        rating: 5,
        description: "Ik hou ook van Westmalle Dubbel!",
        date: new Date(2021, 4, 8, 20, 0),
      },
      {
        id: "7f28c5f9-d711-4cd6-ac15-d13d71abre05",
        user_id: "7f28c5f9-d711-4cd6-ac15-d13d71abus02",
        beer_id: "7f28c5f9-d711-4cd6-ac15-d13d71abbe03",
        rating: 3,
        description: "Is ok",
        date: new Date(2021, 4, 8, 20, 0),
      },
      {
        id: "7f28c5f9-d711-4cd6-ac15-d13d71abre06",
        user_id: "7f28c5f9-d711-4cd6-ac15-d13d71abus03",
        beer_id: "7f28c5f9-d711-4cd6-ac15-d13d71abbe05",
        rating: 5,
        description: "Lekker!",
        date: new Date(2021, 4, 8, 20, 0),
      },
    ]);
  },
};
