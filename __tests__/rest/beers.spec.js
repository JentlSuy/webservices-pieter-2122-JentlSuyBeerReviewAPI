const { tables } = require("../../src/data");
const { withServer, login } = require("../supertest.setup");

const data = {
  breweries: [
    {
      id: "7f28c5f9-d711-4cd6-ac15-d13d71abbr09",
      name: "Duvel Moortgat",
      country: "Belgium",
    },
  ],
  beers: [
    {
      id: "7f28c5f9-d711-4cd6-ac15-d13d71abff83",
      name: "Duvel",
      percentage: 8.5,
      brewery_id: "7f28c5f9-d711-4cd6-ac15-d13d71abbr09",
    },
    {
      id: "7f28c5f9-d711-4cd6-ac15-d13d71abff84",
      name: "Vedett",
      percentage: 5.2,
      brewery_id: "7f28c5f9-d711-4cd6-ac15-d13d71abbr09",
    },
    {
      id: "7f28c5f9-d711-4cd6-ac15-d13d71abff85",
      name: "De Koninck",
      percentage: 5.2,
      brewery_id: "7f28c5f9-d711-4cd6-ac15-d13d71abbr09",
    },
  ],
};

const dataToDelete = {
  beers: [
    "7f28c5f9-d711-4cd6-ac15-d13d71abff83",
    "7f28c5f9-d711-4cd6-ac15-d13d71abff84",
    "7f28c5f9-d711-4cd6-ac15-d13d71abff85",
  ],
  breweries: ["7f28c5f9-d711-4cd6-ac15-d13d71abbr09"],
};

describe("Beers", () => {
  let request;
  let knex;
  let loginHeader;

  withServer(({ knex: k, supertest: s }) => {
    knex = k;
    request = s;
  });

  beforeAll(async () => {
    loginHeader = await login(request);
  });

  // afterAll(async () => {
  //   await server.stop();
  // });

  const url = "/api/beers";

  describe("GET /api/beers", () => {
    beforeAll(async () => {
      await knex(tables.brewery).insert(data.breweries);
      await knex(tables.beer).insert(data.beers);
    });

    afterAll(async () => {
      await knex(tables.beer).whereIn("id", dataToDelete.beers).delete();
      await knex(tables.brewery).whereIn("id", dataToDelete.breweries).delete();
    });

    it("it should 200 and return all beers", async () => {
      const response = await request.get(url).set("Authorization", loginHeader);

      expect(response.status).toBe(200);
      expect(response.body.count).toBeGreaterThanOrEqual(3);
      expect(response.body.data.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe("GET /api/beers/:id", () => {
    beforeAll(async () => {
      await knex(tables.brewery).insert(data.breweries);
      await knex(tables.beer).insert(data.beers[0]);
    });

    afterAll(async () => {
      await knex(tables.beer).where("id", data.beers[0].id).delete();
      await knex(tables.brewery).whereIn("id", dataToDelete.breweries).delete();
    });

    it("it should 200 and return the requested beer", async () => {
      const response = await request
        .get(`${url}/${data.beers[0].id}`)
        .set("Authorization", loginHeader);
      expect(response.status).toBe(200);
      expect(response.body).toEqual(data.beers[0]);
    });
  });

  describe("POST /api/beers", () => {
    const beersToDelete = [];

    beforeAll(async () => {
      await knex(tables.brewery).insert(data.breweries);
    });

    afterAll(async () => {
      await knex(tables.beer).whereIn("id", beersToDelete).delete();
      await knex(tables.brewery).whereIn("id", dataToDelete.breweries).delete();
    });

    it("it should 201 and return the created beer", async () => {
      const response = await request
        .post(url)
        .set("Authorization", loginHeader)
        .send({
          name: "La Chouffe",
          percentage: 8,
          brewery_id: "7f28c5f9-d711-4cd6-ac15-d13d71abbr09",
        });

      expect(response.status).toBe(201);
      expect(response.body.id).toBeTruthy();
      expect(response.body.name).toBe("La Chouffe");
      expect(response.body.percentage).toBe(8);
      expect(response.body.brewery_id).toBe(
        "7f28c5f9-d711-4cd6-ac15-d13d71abbr09"
      );

      beersToDelete.push(response.body.id);
    });

    // it("it should 201 and return the created beer with it's rating", async () => {
    //   const response = await request.post(url).send({
    //     name: "Lovely beer",
    //     rating: 5,
    //   });

    //   expect(response.status).toBe(201);
    //   expect(response.body.id).toBeTruthy();
    //   expect(response.body.name).toBe("Lovely beer");
    //   expect(response.body.rating).toBe(5);

    //   beersToDelete.push(response.body.id);
    // });
  });

  describe("PUT /api/beers/:id", () => {
    beforeAll(async () => {
      await knex(tables.brewery).insert(data.breweries);
      await knex(tables.beer).insert(data.beers);
    });

    afterAll(async () => {
      await knex(tables.beer).whereIn("id", dataToDelete.beers).delete();
      await knex(tables.brewery).whereIn("id", dataToDelete.breweries).delete();
    });

    it("it should 200 and return the updated beer", async () => {
      const response = await request
        .put(`${url}/${data.beers[0].id}`)
        .set("Authorization", loginHeader)
        .send({
          name: "Maredsous Blond",
          percentage: 6,
          brewery_id: "7f28c5f9-d711-4cd6-ac15-d13d71abbr09",
        });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        id: data.beers[0].id,
        name: "Maredsous Blond",
        percentage: 6,
        brewery_id: "7f28c5f9-d711-4cd6-ac15-d13d71abbr09",
      });
    });
  });

  describe("DELETE /api/beers/:id", () => {
    beforeAll(async () => {
      await knex(tables.brewery).insert(data.breweries);
      await knex(tables.beer).insert(data.beers[0]);
    });

    afterAll(async () => {
      await knex(tables.brewery).whereIn("id", dataToDelete.breweries).delete();
    });

    it("it should 204 and return nothing", async () => {
      const response = await request
        .delete(`${url}/${data.beers[0].id}`)
        .set("Authorization", loginHeader);

      expect(response.status).toBe(204);
      expect(response.body).toEqual({});
    });
  });
});
