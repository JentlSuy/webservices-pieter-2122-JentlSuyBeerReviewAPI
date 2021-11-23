const Router = require("@koa/router");
const installReviewRouter = require("./_reviews");
const installHealthRouter = require("./_health");
const installBeerRouter = require("./_beers");
const installUserRouter = require("./_user");

/**
 * Install all routes in the given Koa application.
 *
 * @param {Koa} app - The Koa application.
 */
module.exports = (app) => {
  const router = new Router({
    prefix: "/api",
  });

  installReviewRouter(router);
  installBeerRouter(router);
  installHealthRouter(router);
  installUserRouter(router);

  app.use(router.routes()).use(router.allowedMethods());
};
