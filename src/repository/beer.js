const { tables, getKnex } = require("../data/index");

const findAll = ({ limit, offset }) => {
  return getKnex()(tables.beer)
    .select()
    .limit(limit)
    .offset(offset)
    .orderBy("name", "ASC");
};

/**
 * Find a place with the given `name`.
 *
 * @param {string} name - Name to look for.
 */
const findByName = (name) => {
  return getKnex()(tables.beer).where("name", name).first();
};

/**
 * Find a place with the given `id`.
 *
 * @param {string} id - Id of the place to find.
 */
const findById = (id) => {
  return getKnex()(tables.beer).where("id", id).first();
};

/**
 * Calculate the total number of places.
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
 * @param {number} [beer.percentage] - Alcohol percentage of the beer
 *
 * @returns {Promise<string>} Created beer's id
 */
const create = async ({ name, percentage }) => {
  try {
    const id = uuid.v4();
    await getKnex()(tables.beer).insert({
      id,
      name,
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
 * @param {number} [beer.percentage] - Alcohol percentage of the beer
 *
 * @returns {Promise<string>} Beers's id
 */
const updateById = async (id, { name, percentage }) => {
  try {
    await getKnex()(tables.beer)
      .update({
        name,
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
