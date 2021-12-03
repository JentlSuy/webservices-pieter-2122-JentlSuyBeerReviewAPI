const Router = require("@koa/router");
const breweryService = require("../service/brewery");

const getAllBreweries = async (ctx) => {
  const limit = ctx.query.limit && Number(ctx.query.limit);
  const offset = ctx.query.offset && Number(ctx.query.offset);
  ctx.body = await breweryService.getAll(limit, offset);
};

const createBrewery = async (ctx) => {
  const newBeer = await breweryService.create(ctx.request.body);
  ctx.body = newBeer;
  ctx.status=201;
};

const getBreweryById = async (ctx) => {
  ctx.body = await breweryService.getById(ctx.params.id);
};

const updateBrewery = async (ctx) => {
  ctx.body = await breweryService.updateById(ctx.params.id, ctx.request.body);
};

const deleteBrewery = async (ctx) => {
  await breweryService.deleteById(ctx.params.id);
  ctx.status = 204;
};

/**
 * Install transaction routes in the given router.
 *
 * @param {Router} app - The parent router.
 */
module.exports = (app) => {
  const router = new Router({
    prefix: "/breweries",
  });

  router.get("/", getAllBreweries);
  router.post("/", createBrewery);
  router.get("/:id", getBreweryById);
  router.put("/:id", updateBrewery);
  router.delete("/:id", deleteBrewery);

  app.use(router.routes()).use(router.allowedMethods());
};
