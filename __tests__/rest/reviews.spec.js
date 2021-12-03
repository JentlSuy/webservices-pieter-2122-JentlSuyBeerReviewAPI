const createServer = require("../../src/createServer");
const { getKnex, tables } = require("../../src/data");
const supertest = require("supertest");

const data = {
  reviews: [
    {
      id: "7f28c5f9-d711-4cd6-ac15-d13d71abff86",
      user_id: "7f28c5f9-d711-4cd6-ac15-d13d71abff80",
      beer_id: "7f28c5f9-d711-4cd6-ac15-d13d71abff90",
      rating: 1,
      description: "Niet zo lekker.",
      date: new Date(2021, 4, 25, 19, 40),
    },
    {
      id: "7f28c5f9-d711-4cd6-ac15-d13d71abff87",
      user_id: "7f28c5f9-d711-4cd6-ac15-d13d71abff80",
      beer_id: "7f28c5f9-d711-4cd6-ac15-d13d71abff90",
      rating: 1,
      description: "Kan beter.",
      date: new Date(2021, 4, 8, 20, 0),
    },
    {
      id: "7f28c5f9-d711-4cd6-ac15-d13d71abff88",
      user_id: "7f28c5f9-d711-4cd6-ac15-d13d71abff80",
      beer_id: "7f28c5f9-d711-4cd6-ac15-d13d71abff90",
      rating: 0,
      description: "Geen fan.",
      date: new Date(2021, 4, 21, 14, 30),
    },
  ],
  breweries: [
    {
      id: "7f28c5f9-d711-4cd6-ac15-d13d71abbr09",
      name: "Alken-Maes",
      country: "Belgium",
    },
  ],
  beers: [
    {
      id: "7f28c5f9-d711-4cd6-ac15-d13d71abff90",
      name: "Maes",
      percentage: 5.2,
      brewery_id: "7f28c5f9-d711-4cd6-ac15-d13d71abbr09",
    },
  ],
  users: [
    {
      id: "7f28c5f9-d711-4cd6-ac15-d13d71abff80",
      name: "Test User",
    },
  ],
};

const dataToDelete = {
  reviews: [
    "7f28c5f9-d711-4cd6-ac15-d13d71abff86",
    "7f28c5f9-d711-4cd6-ac15-d13d71abff87",
    "7f28c5f9-d711-4cd6-ac15-d13d71abff88",
  ],
  breweries: ["7f28c5f9-d711-4cd6-ac15-d13d71abbr09"],
  beers: ["7f28c5f9-d711-4cd6-ac15-d13d71abff90"],
  users: ["7f28c5f9-d711-4cd6-ac15-d13d71abff80"],
};

describe("Review", () => {
  let server; // de server
  let request; // waarmee we HTTP requests gaan doen
  let knex; // de huidige Knex instantie
  beforeAll(async () => {
    server = await createServer();
    request = supertest(server.getApp().callback());
    knex = getKnex();
  });

  afterAll(async () => {
    await server.stop();
  });

  const url = "/api/reviews";

  describe("GET /api/reviews", () => {
    beforeAll(async () => {
      await knex(tables.brewery).insert(data.breweries);
      await knex(tables.beer).insert(data.beers);
      await knex(tables.user).insert(data.users);
      await knex(tables.review).insert(data.reviews);
    });

    afterAll(async () => {
      await knex(tables.review).whereIn("id", dataToDelete.reviews).delete();
      await knex(tables.beer).whereIn("id", dataToDelete.beers).delete();
      await knex(tables.brewery).whereIn("id", dataToDelete.breweries).delete();
      await knex(tables.user).whereIn("id", dataToDelete.users).delete();
    });

    it("should 200 and return all reviews", async () => {
      const response = await request.get(url);
      expect(response.status).toBe(200);
      expect(response.body.limit).toBe(100);
      expect(response.body.offset).toBe(0);
      expect(response.body.count).toBeGreaterThanOrEqual(3);
      expect(response.body.data.length).toBeGreaterThanOrEqual(3);
    });

    it("it should 200 and paginate the list of reviews", async () => {
      const response = await request.get(`${url}?limit=2&offset=1`);
      expect(response.status).toBe(200);
      // expect(response.body.data.length).toBe(2);
      expect(response.body.limit).toBe(2);
      expect(response.body.offset).toBe(1);
      expect(response.body.data[0]).toEqual({
        id: "7f28c5f9-d711-4cd6-ac15-d13d71abff88",
        rating: 0,
        description: "Geen fan.",
        date: new Date(2021, 4, 21, 14, 30).toJSON(),
        beer: {
          id: "7f28c5f9-d711-4cd6-ac15-d13d71abff90",
          name: "Maes",
        },
        user: {
          id: "7f28c5f9-d711-4cd6-ac15-d13d71abff80",
          name: "Test User",
        },
      });
      expect(response.body.data[1]).toEqual({
        id: "7f28c5f9-d711-4cd6-ac15-d13d71abff86",
        rating: 1,
        description: "Niet zo lekker.",
        date: new Date(2021, 4, 25, 19, 40).toJSON(),
        beer: {
          id: "7f28c5f9-d711-4cd6-ac15-d13d71abff90",
          name: "Maes",
        },
        user: {
          id: "7f28c5f9-d711-4cd6-ac15-d13d71abff80",
          name: "Test User",
        },
      });
    });
  });

  describe("GET /api/reviews/:id", () => {
    beforeAll(async () => {
      await knex(tables.brewery).insert(data.breweries);
      await knex(tables.beer).insert(data.beers);
      await knex(tables.user).insert(data.users);
      await knex(tables.review).insert(data.reviews[0]);
    });

    afterAll(async () => {
      await knex(tables.review).where("id", dataToDelete.reviews[0]).delete();
      await knex(tables.beer).whereIn("id", dataToDelete.beers).delete();
      await knex(tables.brewery).whereIn("id", dataToDelete.breweries).delete();
      await knex(tables.user).whereIn("id", dataToDelete.users).delete();
    });

    it("it should 200 and return the requested review", async () => {
      const reviewId = data.reviews[0].id;
      const response = await request.get(`${url}/${reviewId}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        id: reviewId,
        rating: 1,
        description: "Niet zo lekker.",
        date: new Date(2021, 4, 25, 19, 40).toJSON(),
        beer: {
          id: "7f28c5f9-d711-4cd6-ac15-d13d71abff90",
          name: "Maes",
        },
        user: {
          id: "7f28c5f9-d711-4cd6-ac15-d13d71abff80",
          name: "Test User",
        },
      });
    });
  });

  describe("POST /api/reviews", () => {
    const reviewsToDelete = [];
    const usersToDelete = [];

    beforeAll(async () => {
      await knex(tables.brewery).insert(data.breweries);
      await knex(tables.beer).insert(data.beers);
      await knex(tables.user).insert(data.users);
    });

    afterAll(async () => {
      await knex(tables.review).whereIn("id", reviewsToDelete).delete();
      await knex(tables.beer).whereIn("id", dataToDelete.beers).delete();
      await knex(tables.brewery).whereIn("id", dataToDelete.breweries).delete();
      await knex(tables.user).whereIn("id", usersToDelete).delete();
    });

    it("it should 201 and return the created review", async () => {
      const response = await request.post(url).send({
        rating: 5,
        description: "Geen fan van Maes.",
        date: "2021-05-27T13:00:00.000Z",
        beerId: "7f28c5f9-d711-4cd6-ac15-d13d71abff90",
        userId: "7f28c5f9-d711-4cd6-ac15-d13d71abff80",
      });

      expect(response.status).toBe(201);
      expect(response.body.id).toBeTruthy();
      expect(response.body.rating).toBe(5);
      expect(response.body.description).toBe("Geen fan van Maes.");
      expect(response.body.date).toBe("2021-05-27T13:00:00.000Z");
      expect(response.body.beer).toEqual({
        id: "7f28c5f9-d711-4cd6-ac15-d13d71abff90",
        name: "Maes",
      });
      expect(response.body.user.id).toBeTruthy();
      expect(response.body.user.name).toBe("Test User");

      reviewsToDelete.push(response.body.id);
      usersToDelete.push(response.body.user.id);
    });
  });

  describe("PUT /api/reviews/:id", () => {
    const usersToDelete = [];

    beforeAll(async () => {
      await knex(tables.brewery).insert(data.breweries);
      await knex(tables.beer).insert(data.beers);
      await knex(tables.user).insert(data.users);
      await knex(tables.review).insert([
        {
          id: "7f28c5f9-d711-4cd6-ac15-d13d71abff89",
          user_Id: "7f28c5f9-d711-4cd6-ac15-d13d71abff80",
          beer_Id: "7f28c5f9-d711-4cd6-ac15-d13d71abff90",
          rating: 5,
          description: "Super lekker!",
          date: new Date(2021, 4, 25, 19, 40),
        },
      ]);
    });

    afterAll(async () => {
      await knex(tables.review)
        .where("id", "7f28c5f9-d711-4cd6-ac15-d13d71abff89")
        .delete();
      await knex(tables.beer).whereIn("id", dataToDelete.beers).delete();
      await knex(tables.brewery).whereIn("id", dataToDelete.breweries).delete();
      await knex(tables.user)
        .whereIn("id", [...dataToDelete.users, ...usersToDelete])
        .delete();
    });

    it("it should 200 and return the updated transaction", async () => {
      const response = await request
        .put(`${url}/7f28c5f9-d711-4cd6-ac15-d13d71abff89`)
        .send({
          rating: 0,
          description: "Geen fan van Maes.",
          date: "2020-05-27T13:00:00.000Z",
          beerId: "7f28c5f9-d711-4cd6-ac15-d13d71abff90",
          userId: "7f28c5f9-d711-4cd6-ac15-d13d71abff80",
        });

      expect(response.status).toBe(200);
      expect(response.body.id).toBeTruthy();
      expect(response.body.rating).toBe(0);
      expect(response.body.description).toBe("Geen fan van Maes.");
      expect(response.body.date).toBe("2020-05-27T13:00:00.000Z");
      expect(response.body.beer).toEqual({
        id: "7f28c5f9-d711-4cd6-ac15-d13d71abff90",
        name: "Maes",
      });
      expect(response.body.user.name).toEqual("Test User");

      usersToDelete.push(response.body.user.id);
    });
  });

  describe("DELETE /api/reviews/:id", () => {
    beforeAll(async () => {
      await knex(tables.brewery).insert(data.breweries);
      await knex(tables.beer).insert(data.beers);
      await knex(tables.user).insert(data.users);

      await knex(tables.review).insert([
        {
          id: "7f28c5f9-d711-4cd6-ac15-d13d71abff89",
          user_Id: "7f28c5f9-d711-4cd6-ac15-d13d71abff80",
          beer_Id: "7f28c5f9-d711-4cd6-ac15-d13d71abff90",
          rating: 5,
          description: "Super lekker!",
          date: new Date(2021, 4, 25, 19, 40),
        },
      ]);
    });

    afterAll(async () => {
      await knex(tables.beer).whereIn("id", dataToDelete.beers).delete();
      await knex(tables.brewery).whereIn("id", dataToDelete.breweries).delete();
      await knex(tables.user).whereIn("id", dataToDelete.users).delete();
    });

    it("it should 204 and return nothing", async () => {
      const response = await request.delete(
        `${url}/7f28c5f9-d711-4cd6-ac15-d13d71abff89`
      );
      expect(response.status).toBe(204);
      expect(response.body).toEqual({});
    });
  });
});
