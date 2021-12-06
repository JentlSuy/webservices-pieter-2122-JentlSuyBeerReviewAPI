const { shutdownData, getKnex, tables } = require("../src/data");

module.exports = async () => {
  await getKnex()(tables.review).delete();
  await getKnex()(tables.user).delete();
  await getKnex()(tables.beer).delete();
  await getKnex()(tables.brewery).delete();

  await shutdownData();
};
