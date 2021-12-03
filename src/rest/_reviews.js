const Router = require("@koa/router");
const reviewService = require("../service/review");

const getAllReviews = async (ctx) => {
  const limit = ctx.query.limit && Number(ctx.query.limit);
  const offset = ctx.query.offset && Number(ctx.query.offset);
  ctx.body = await reviewService.getAll(limit, offset);
};

const createReview = async (ctx) => {
  const newReview = await reviewService.create({
    ...ctx.request.body,
    date: new Date(ctx.request.body.date),
  });
  ctx.body = newReview;
  ctx.status=201;
};

const getReviewById = async (ctx) => {
  ctx.body = await reviewService.getById(ctx.params.id);
};

const updateReview = async (ctx) => {
  ctx.body = await reviewService.updateById(ctx.params.id, {
    ...ctx.request.body,
    date: new Date(ctx.request.body.date),
  });
};

const deleteReview = async (ctx) => {
  await reviewService.deleteById(ctx.params.id);
  ctx.status = 204;
};

/**
 * Install review routes in the given router.
 *
 * @param {Router} app - The parent router.
 */
module.exports = (app) => {
  const router = new Router({
    prefix: "/reviews",
  });

  router.get("/", getAllReviews);
  router.post("/", createReview);
  router.get("/:id", getReviewById);
  router.put("/:id", updateReview);
  router.delete("/:id", deleteReview);

  app.use(router.routes()).use(router.allowedMethods());
};
