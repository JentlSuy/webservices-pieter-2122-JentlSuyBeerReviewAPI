const config = require("config");
const { getChildLogger } = require("../core/logging");
const reviewRepository = require("../repository/review");
const userService = require("./user");

const DEFAULT_PAGINATION_LIMIT = config.get("pagination.limit");
const DEFAULT_PAGINATION_OFFSET = config.get("pagination.offset");

const debugLog = (message, meta = {}) => {
  if (!this.logger) this.logger = getChildLogger("review-service");
  this.logger.debug(message, meta);
};

/**
 * Get all `limit` reviews, skip the first `offset`.
 *
 * @param {number} [limit] - Nr of reviews to fetch.
 * @param {number} [offset] - Nr of reviews to skip.
 */
const getAll = async (
  limit = DEFAULT_PAGINATION_LIMIT,
  offset = DEFAULT_PAGINATION_OFFSET
) => {
  debugLog("Fetching all reviews", { limit, offset });
  const data = await reviewRepository.findAll({ limit, offset });
  const count = await reviewRepository.findCount();
  return {
    data,
    count,
    limit,
    offset,
  };
};

/**
 * Get the review with the given `id`.
 *
 * @param {number} id - Id of the review to find.
 */
const getById = async (id) => {
  debugLog(`Fetching review with id ${id}`);
  const review = await reviewRepository.findById(id);

  if (!review) {
    throw new Error(`There is no review with id ${id}`);
  }

  return review;
};

/**
 * Create a new review, will create a new beer if necessary.
 *
 * @param {object} review - The review to create.
 * @param {string} review.rating - Rating of the beer.
 * @param {string} review.description - Description of the review.
 * @param {Date} review.date - Date of the review.
 * @param {string} review.beerId - Id of the beer that was reviewed.
 * @param {string} review.user - Name of the user who did the review.
 */
const create = async ({ rating, description, date, beerId, user }) => {
  debugLog("Creating new review", { rating, description, date, beerId, user });

  // For now simply create a new user every time
  const { id: userId } = await userService.register({ name: user });

  return reviewRepository.create({
    rating,
    description,
    date,
    beerId,
    userId,
  });
};

/**
 * Update an existing review, will create a new beer if necessary.
 *
 * @param {string} id - Id of the review to update.
 * @param {object} review - The review data to save.
 * @param {string} [review.rating] - Rating of the beer.
 * @param {Date} [review.date] - Date of the review.
 * @param {string} [review.beerId] - Id of the beer the rwas reviewed.
 * @param {string} [review.user] - Name of the user who did the review.
 */
const updateById = async (id, { rating, description, date, beerId, user }) => {
  debugLog(`Updating review with id ${id}`, {
    rating,
    description,
    date,
    beerId,
    user,
  });

  // For now simply create a new user every time
  const { id: userId } = await userService.register({ name: user });

  return reviewRepository.updateById(id, {
    rating,
    description,
    date,
    beerId,
    userId,
  });
};

/**
 * Delete the review with the given `id`.
 *
 * @param {number} id - Id of the review to delete.
 */
const deleteById = async (id) => {
  debugLog(`Deleting review with id ${id}`);
  await reviewRepository.deleteById(id);
};

module.exports = {
  getAll,
  getById,
  create,
  updateById,
  deleteById,
};
