const uuid = require("uuid");
const { getLogger } = require("../core/logging");
let { REVIEWS, BEERS, BREWERIES } = require("../data/mock_data");

const getAll = () => {
  return Promise.resolve({
    data: REVIEWS,
    count: REVIEWS.length,
  });
};

const getById = async (id) => {
  return Promise.resolve(REVIEWS.filter((t) => t.id === id)[0]);
};

const create = async ({ rating, description, date, beerId, user }) => {
  return new Promise((resolve) => {
    let existingBeer;
    if (beerId) {
      existingBeer = BEERS.filter((b) => b.id === beerId)[0];

      if (!existingBeer) {
        getLogger().error(`There is no beer with id ${beerId}`);
      }
    }

    if (typeof user === "string") {
      user = {
        id: uuid.v4(),
        name: user,
      };
    }

    const newReview = {
      id: uuid.v4(),
      rating,
      description,
      date: date.toISOString(),
      beer: existingBeer,
      user,
    };
    REVIEWS = [...REVIEWS, newReview];
    resolve(newReview);
  });
};

const updateById = async (id, { rating, description, date, beerId, user }) => {
  return new Promise((resolve) => {
    let existingBeer;
    if (beerId) {
      existingBeer = BEERS.filter((p) => p.id === beerId)[0];

      if (!existingBeer) {
        getLogger().error(`There is no beer with id ${beerId}`);
      }
    }

    if (typeof user === "string") {
      user = {
        id: uuid.v4(),
        name: user,
      };
    }

    REVIEWS = REVIEWS.map((review) => {
      return review.id === id
        ? {
            ...review,
            rating,
            description,
            date,
            beer: existingBeer,
            user,
          }
        : review;
    });
    resolve(getById(id));
  });
};

const deleteById = async (id) => {
  return new Promise((resolve) => {
    REVIEWS = REVIEWS.filter((r) => r.id !== id);
    resolve();
  });
};

module.exports = {
  getAll,
  getById,
  create,
  updateById,
  deleteById,
};
