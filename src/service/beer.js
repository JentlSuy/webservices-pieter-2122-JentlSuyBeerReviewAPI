const config = require('config');
const { getChildLogger } = require('../core/logging');
const beerRepository = require('../repository/beer');

const DEFAULT_PAGINATION_LIMIT = config.get('pagination.limit');
const DEFAULT_PAGINATION_OFFSET = config.get('pagination.offset');

const debugLog = (message, meta = {}) => {
	if (!this.logger) this.logger = getChildLogger('beer-service');
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
	offset = DEFAULT_PAGINATION_OFFSET,
) => {
	debugLog('Fetching all beers', { limit, offset });
	const data = await beerRepository.findAll({ limit, offset });
	const count = await beerRepository.findCount();
	return { data, count, limit, offset };
};

/**
 * Get the beer with the given `id`.
 *
 * @param {string} id - Id of the beer to get.
 */
const getById = (id) => {
	debugLog(`Fetching beer with id ${id}`);
	return beerRepository.findById(id);
};

/**
 * Create a new beer.
 *
 * @param {object} beer - Beer to create.
 * @param {string} beer.name - Name of the beer.
 * @param {number} [beer.percentage] - Alcohol percentage of the beer.
 */
const create = ({ name, rating }) => {
	const newBeer = { name, rating };
	debugLog('Creating new beer', newBeer);
	return beerRepository.create(newBeer);
};

/**
 * Update an existing beer.
 *
 * @param {string} id - Id of the beer to update.
 * @param {object} beer - Beer to save.
 * @param {string} [beer.name] - Name of the beer.
 * @param {number} [beer.percentage] - Alcohol percentage of the beer.
 */
const updateById = (id, { name, rating }) => {
	const updatedBeer = { name, rating };
	debugLog(`Updating beer with id ${id}`, updatedBeer);
	return beerRepository.updateById(id, updatedBeer);
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

module.exports = {
	getAll,
	getById,
	create,
	updateById,
	deleteById,
};
