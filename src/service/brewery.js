const config = require("config");
const { getChildLogger } = require("../core/logging");
const beerRepository = require("../repository/brewery");

const DEFAULT_PAGINATION_LIMIT = config.get("pagination.limit");
const DEFAULT_PAGINATION_OFFSET = config.get("pagination.offset");

const debugLog = (message, meta = {}) => {
  if (!this.logger) this.logger = getChildLogger("brewery-service");
  this.logger.debug(message, meta);
};

/**
 * Get all `limit` breweries, skip the first `offset`.
 *
 * @param {number} [limit] - Nr of breweries to fetch.
 * @param {number} [offset] - Nr of breweries to skip.
 */
const getAll = async (
  limit = DEFAULT_PAGINATION_LIMIT,
  offset = DEFAULT_PAGINATION_OFFSET
) => {
  debugLog("Fetching all breweries", { limit, offset });
  const data = await beerRepository.findAll({ limit, offset });
  const count = await beerRepository.findCount();
  return { data, count, limit, offset };
};

/**
 * Get the brewery with the given `id`.
 *
 * @param {string} id - Id of the brewery to get.
 * @throws {ServiceError} One of:
 * - NOT_FOUND: No brewery with the given id could be found.
 */
const getById = async (id) => {
  debugLog(`Fetching brewery with id ${id}`);
  const brewery = await beerRepository.findById(id);

  if (!brewery) {
    throw new Error(`No brewery with id ${id} exists`, { id });
  }

  return brewery;
};

/**
 * Create a new brewery.
 *
 * @param {object} brewery - Brewery to create.
 * @param {string} brewery.name - Name of the brewery.
 * @param {string} [brewery.country] - Country of the brewery.
 */
const create = ({ name, country }) => {
  const newBrewery = { name, country };
  debugLog("Creating new brewery", newBrewery);
  return beerRepository.create(newBrewery);
};

/**
 * Update an existing brewery.
 *
 * @param {string} id - Id of the brewery to update.
 * @param {object} brewery - Brewery to save.
 * @param {string} [brewery.name] - Name of the brewery.
 * @param {string} [brewery.country] - Country of the brewery.
 */
const updateById = (id, { name, country }) => {
  const updatedBrewery = { name, country };
  debugLog(`Updating brewery with id ${id}`, updatedBrewery);
  return beerRepository.updateById(id, updatedBrewery);
};

/**
 * Delete an existing brewery.
 *
 * @param {string} id - Id of the brewery to delete.
 */
const deleteById = async (id) => {
  debugLog(`Deleting brewery with id ${id}`);
  await beerRepository.deleteById(id);
};

module.exports = {
  getAll,
  getById,
  create,
  updateById,
  deleteById,
};
