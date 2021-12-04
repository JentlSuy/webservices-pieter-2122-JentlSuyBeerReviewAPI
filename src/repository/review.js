const uuid = require("uuid");

const { tables, getKnex } = require("../data/index");
const { getChildLogger } = require("../core/logging");

const SELECT_COLUMNS = [
  `${tables.review}.id`,
  "rating",
  "description",
  "date",
  `${tables.beer}.id as beer_id`,
  `${tables.beer}.name as beer_name`,
  `${tables.user}.id as user_id`,
  `${tables.user}.name as user_name`,
];

const formatReview = ({ beer_id, beer_name, user_id, user_name, ...rest }) => ({
  ...rest,
  beer: {
    id: beer_id,
    name: beer_name,
  },
  user: {
    id: user_id,
    name: user_name,
  },
});

/**
 * Get all `limit` reviews, throws on error.
 *
 * @param {object} pagination - Pagination options
 * @param {number} pagination.limit - Nr of reviews to return.
 * @param {number} pagination.offset - Nr of reviews to skip.
 */
const findAll = async ({ limit, offset }) => {
  const reviews = await getKnex()(tables.review)
    .select(SELECT_COLUMNS)
    .join(tables.beer, `${tables.review}.beer_id`, "=", `${tables.beer}.id`)
    .join(tables.user, `${tables.review}.user_id`, "=", `${tables.user}.id`)
    .limit(limit)
    .offset(offset)
    .orderBy("date", "ASC");

  return reviews.map(formatReview);
};

/**
 * Calculate the total number of reviews.
 */
const findCount = async () => {
  const [count] = await getKnex()(tables.review).count();

  return count["count(*)"];
};

/**
 * Find a review with the given `id`.
 *
 * @param {string} id - Id of the review to find.
 */
const findById = async (id) => {
  const review = await getKnex()(tables.review)
    .first(SELECT_COLUMNS)
    .where(`${tables.review}.id`, id)
    .join(tables.beer, `${tables.review}.beer_id`, "=", `${tables.beer}.id`)
    .join(tables.user, `${tables.review}.user_id`, "=", `${tables.user}.id`);

  return review && formatReview(review);
};

/**
 * Create a new review.
 *
 * @param {object} review - The review to create.
 * @param {string} review.rating - Rating of the beer that is in the review.
 * @param {string} review.description - Description of the review.
 * @param {Date} review.date - Date of the review.
 * @param {string} review.beerId - Id of the beer that was reviewed.
 * @param {string} review.userId - Id of the user who did the transaction.
 *
 * @returns {Promise<object>} Created transaction
 */
const create = async ({ rating, description, date, beerId, userId }) => {
  try {
    const id = uuid.v4();
    await getKnex()(tables.review).insert({
      id,
      rating,
      description,
      date,
      beer_id: beerId,
      user_id: userId,
    });
    return await findById(id);
  } catch (error) {
    const logger = getChildLogger("reviews-repo");
    logger.error("Error in create", {
      error,
    });
    throw error;
  }
};

/**
 * Update an existing review.
 *
 * @param {string} id - Id of the review to update.
 * @param {object} review - The review data to save.
 * @param {string} [review.rating] - Rating of the beer that is in the review.
 * @param {string} [review.description] - Description of the review.
 * @param {Date} [review.date] - Date of the review.
 * @param {string} [review.beerId] - Id of the beer that has been reviewed.
 * @param {string} [review.userId] - Id of the user who did the review.
 *
 * @returns {Promise<object>} Updated review
 */
const updateById = async (
  id,
  { rating, description, date, beerId, userId },
) => {
  try {
    await getKnex()(tables.review)
      .update({
        rating,
        description,
        date,
        beer_id: beerId,
        user_id: userId,
      })
      .where(`${tables.review}.id`, id);
    return await findById(id);
  } catch (error) {
    const logger = getChildLogger("reviews-repo");
    logger.error("Error in updateById", {
      error,
    });
    throw error;
  }
};

/**
 * Delete a review with the given `id`.
 *
 * @param {string} id - Id of the review to delete.
 *
 * @returns {Promise<boolean>} Whether the review was deleted.
 */
const deleteById = async (id) => {
  try {
    const rowsAffected = await getKnex()(tables.review)
      .delete()
      .where(`${tables.review}.id`, id);
    return rowsAffected > 0;
  } catch (error) {
    const logger = getChildLogger("reviews-repo");
    logger.error("Error in deleteById", {
      error,
    });
    throw error;
  }
};

module.exports = {
  findAll,
  findCount,
  findById,
  create,
  updateById,
  deleteById,
};
