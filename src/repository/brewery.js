const uuid = require("uuid");

const { tables, getKnex } = require("../data/index");
const { getChildLogger } = require("../core/logging");

const findAll = ({ limit, offset }) => {
  return getKnex()(tables.brewery)
    .select()
    .limit(limit)
    .offset(offset)
    .orderBy("name", "ASC");
};

/**
 * Find a brewery with the given `name`.
 *
 * @param {string} name - Name to look for.
 */
const findByName = (name) => {
  return getKnex()(tables.brewery).where("name", name).first();
};

/**
 * Find a brewery with the given `id`.
 *
 * @param {string} id - Id of the place to find.
 */
const findById = (id) => {
  return getKnex()(tables.brewery).where("id", id).first();
};

/**
 * Calculate the total number of breweries.
 */
const findCount = async () => {
  const [count] = await getKnex()(tables.brewery).count();
  return count["count(*)"];
};

/**
 * Create a new brewery with the given `name` and `country`.
 *
 * @param {object} brewery - Brewery to create.
 * @param {string} brewery.name - Name of the brewery.
 * @param {string} beer.percentage - Country of the brewery
 *
 * @returns {Promise<string>} Created berwery's id
 */
const create = async ({ name, country }) => {
  try {
    const id = uuid.v4();
    await getKnex()(tables.brewery).insert({
      id,
      name,
      country,
    });

    return await findById(id);
  } catch (error) {
    const logger = getChildLogger("breweries-repo");
    logger.error("Error in create", {
      error,
    });
    throw error;
  }
};

/**
 * Update an existing brewery with the given `name` and `country`.
 *
 * @param {string} id - Id of the brewery to update.
 * @param {object} brewery - Brewery to create.
 * @param {string} [brewery.name] - Name of the brewery.
 * @param {number} [brewery.country] - Country of the brewery
 *
 * @returns {Promise<string>} brewery's id
 */
const updateById = async (id, { name, country }) => {
  try {
    await getKnex()(tables.brewery)
      .update({
        name,
        country,
      })
      .where("id", id);

    return await findById(id);
  } catch (error) {
    const logger = getChildLogger("breweries-repo");
    logger.error("Error in updateById", {
      error,
    });
    throw error;
  }
};

/**
 * Delete a brewery.
 *
 * @param {string} id - Id of the brewery to delete.
 *
 * @returns {Promise<boolean>} Whether the brewery was deleted.
 */
const deleteById = async (id) => {
  try {
    const rowsAffected = await getKnex()(tables.brewery)
      .delete()
      .where("id", id);

    return rowsAffected > 0;
  } catch (error) {
    const logger = getChildLogger("breweries-repo");
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
