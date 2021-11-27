const config = require("config");
const { getChildLogger } = require("../core/logging");
const beerRepository = require("../repository/beer");
const breweryService = require("./brewery");

const DEFAULT_PAGINATION_LIMIT = config.get("pagination.limit");
const DEFAULT_PAGINATION_OFFSET = config.get("pagination.offset");

const debugLog = (message, meta = {}) => {
  if (!this.logger) this.logger = getChildLogger("beer-service");
  this.logger.debug(message, meta);
};

/**
 * Get all `limit` beers, skip the first `offset`.
 *
 * @param {number} [limit] - Nr of beers to fetch.
 * @param {number} [offset] - Nr of beers to skip.
 */
const getAll = async (
  limit = DEFAULT_PAGINATION_LIMIT,
  offset = DEFAULT_PAGINATION_OFFSET
) => {
  debugLog("Fetching all beers", { limit, offset });
  const data = await beerRepository.findAll({ limit, offset });
  const count = await beerRepository.findCount();
  return { data, count, limit, offset };
};

/**
 * Get the beer with the given `id`.
 *
 * @param {string} id - Id of the beer to get.
 * @throws {ServiceError} One of:
 * - NOT_FOUND: No beer with the given id could be found.
 */
const getById = async (id) => {
  debugLog(`Fetching beer with id ${id}`);
  const beer = await beerRepository.findById(id);

  if (!beer) {
    throw new Error(`No beer with id ${id} exists`, { id });
  }

  return beer;
};

/**
 * Create a new beer.
 *
 * @param {object} beer - Beer to create.
 * @param {string} beer.name - Name of the beer.
 * @param {number} [beer.percentage] - Alcohol percentage of the beer.
 * @param {number} [beer.brewery_id] - Id of the brewery of the beer.
 */
const create = async ({ name, percentage, brewery_id }) => {
  const newBeer = { name, percentage, brewery_id };
  debugLog("Creating new beer", newBeer);

  let doUpdate = true;
  try {
    const breweryError = await breweryService.getById(brewery_id);
  } catch {
    debugLog(`No brewery found with id ${brewery_id}`);
    doUpdate = false;
    return `No brewery found with id ${brewery_id}`;
    //TODO ERROR STATUS CODE!!!
  }

  if (checkPercentageError(percentage)) {
    message =
      "The alcohol percentage can not be larger then 100 % or smaller then 0 %.";
    debugLog(message);
    doUpdate = false;
    return message;
  }

  if (doUpdate) {
    return beerRepository.create(newBeer);
  }
};

/**
 * Update an existing beer.
 *
 * @param {string} id - Id of the beer to update.
 * @param {object} beer - Beer to save.
 * @param {string} [beer.name] - Name of the beer.
 * @param {number} [beer.percentage] - Alcohol percentage of the beer.
 * @param {number} [beer.brewery_id] - Id of the brewery of the beer.
 */
const updateById = async (id, { name, percentage, brewery_id }) => {
  const updatedBeer = { name, percentage, brewery_id };
  debugLog(`Updating beer with id ${id}`, updatedBeer);

  let doUpdate = true;
  try {
    const breweryError = await breweryService.getById(brewery_id);
  } catch {
    debugLog(`No brewery found with id ${brewery_id}`);
    doUpdate = false;
    return `No brewery found with id ${brewery_id}`;
    //TODO ERROR STATUS CODE!!!
  }

  if (checkPercentageError(percentage)) {
    message =
      "The alcohol percentage can not be larger then 100 % or smaller then 0 %.";
    debugLog(message);
    doUpdate = false;
    return message;
  }

  if (doUpdate) {
    return beerRepository.updateById(id, updatedBeer);
  }
};

/**
 * Delete an existing beer.
 *
 * @param {string} id - Id of the beer to delete.
 */
const deleteById = async (id) => {
  debugLog(`Deleting beer with id ${id}`);
  await beerRepository.deleteById(id);
};

function checkPercentageError(percentage) {
  if (percentage > 100 || percentage < 0) return true;
}

module.exports = {
  getAll,
  getById,
  create,
  updateById,
  deleteById,
};
