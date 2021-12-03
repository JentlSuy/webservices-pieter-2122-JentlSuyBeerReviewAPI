const Router = require("@koa/router");
const beerService = require("../service/beer");

const getAllBeers = async (ctx) => {
  const limit = ctx.query.limit && Number(ctx.query.limit);
  const offset = ctx.query.offset && Number(ctx.query.offset);
  ctx.body = await beerService.getAll(limit, offset);
};

const createBeer = async (ctx) => {
  if (ctx.request.body.percentage < 0 || ctx.request.body.percentage > 100) {
    ctx.status = 500
  } else {
    ctx.status = 201;
  }
  const newBeer = await beerService.create(ctx.request.body);
  ctx.body = newBeer;
 
};

const getBeerById = async (ctx) => {
  ctx.body = await beerService.getById(ctx.params.id);
};

const updateBeer = async (ctx) => {
  ctx.body = await beerService.updateById(ctx.params.id, ctx.request.body);
};

const deleteBeer = async (ctx) => {
  await beerService.deleteById(ctx.params.id);
  ctx.status = 204;
};

/**
 * Install transaction routes in the given router.
 *
 * @param {Router} app - The parent router.
 */
module.exports = (app) => {
  const router = new Router({
    prefix: "/beers",
  });

  router.get("/", getAllBeers);
  router.post("/", createBeer);
  router.get("/:id", getBeerById);
  router.put("/:id", updateBeer);
  router.delete("/:id", deleteBeer);

  app.use(router.routes()).use(router.allowedMethods());
};
