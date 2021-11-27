const uuid = require('uuid');
const { tables, getKnex } = require("../data/index");
const { getChildLogger } = require("../core/logging");

const findAll = ({ limit, offset }) => {
  return getKnex()(tables.beer)
    .select()
    .limit(limit)
    .offset(offset)
    .orderBy("name", "ASC");
};

/**
 * Find a beer with the given `name`.
 *
 * @param {string} name - Name to look for.
 */
const findByName = (name) => {
  return getKnex()(tables.beer).where("name", name).first();
};

/**
 * Find a beer with the given `id`.
 *
 * @param {string} id - Id of the place to find.
 */
const findById = (id) => {
  return getKnex()(tables.beer).where("id", id).first();
};

/**
 * Calculate the total number of beers.
 */
const findCount = async () => {
  const [count] = await getKnex()(tables.beer).count();
  return count["count(*)"];
};

/**
 * Create a new beer with the given `name` and `percentage`.
 *
 * @param {object} beer - Beer to create.
 * @param {string} beer.name - Name of the beer.
 * @param {string} beer.brewery_id - Id of the brewery
 * @param {number} [beer.percentage] - Alcohol percentage of the beer
 *
 * @returns {Promise<string>} Created beer's id
 */
const create = async ({ name, brewery_id, percentage }) => {
  try {
    const id = uuid.v4();
    await getKnex()(tables.beer).insert({
      id,
      name,
      brewery_id,
      percentage,
    });

    return await findById(id);
  } catch (error) {
    const logger = getChildLogger("beers-repo");
    logger.error("Error in create", {
      error,
    });
    throw error;
  }
};

/**
 * Update an existing beer with the given `name` and `percentage`.
 *
 * @param {string} id - Id of the beer to update.
 * @param {object} beer - Beer to create.
 * @param {string} [beer.name] - Name of the place.
 * @param {string} beer.brewery_id - Id of the brewery
 * @param {number} [beer.percentage] - Alcohol percentage of the beer
 *
 * @returns {Promise<string>} Beers's id
 */
const updateById = async (id, { name, brewery_id, percentage }) => {
  try {
    await getKnex()(tables.beer)
      .update({
        name,
        brewery_id,
        percentage,
      })
      .where("id", id);

    return await findById(id);
  } catch (error) {
    const logger = getChildLogger("beers-repo");
    logger.error("Error in updateById", {
      error,
    });
    throw error;
  }
};

/**
 * Delete a beer.
 *
 * @param {string} id - Id of the beer to delete.
 *
 * @returns {Promise<boolean>} Whether the beer was deleted.
 */
const deleteById = async (id) => {
  try {
    const rowsAffected = await getKnex()(tables.beer).delete().where("id", id);

    return rowsAffected > 0;
  } catch (error) {
    const logger = getChildLogger("beers-repo");
    logger.error("Error in deleteById", {
      error,
    });
    throw error;
  }
};

module.exports = {
  findAll,
  findById,
  findCount,
  findByName,
  create,
  updateById,
  deleteById,
};
