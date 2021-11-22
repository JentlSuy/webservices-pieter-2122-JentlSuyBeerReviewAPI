const config = require("config");
const Koa = require("koa");
const Router = require("@koa/router");
const bodyParser = require("koa-bodyparser");
const koaCors = require("@koa/cors");
const { getLogger } = require("./core/logging");
const { initializeData } = require("./data");
const reviewService = require("./service/review");

const PORT = config.get("port");
const HOST = config.get("host");
const PROTOCOL = config.get("protocol");
const NODE_ENV = config.get("env");
const CORS_ORIGINS = config.get("cors.origins");
const CORS_MAX_AGE = config.get("cors.maxAge");
const LOG_LEVEL = config.get("log.level");
const LOG_DISABLED = config.get("log.disabled");

console.log(`NODE_ENV = ${NODE_ENV}`);
console.log(`log level = ${LOG_LEVEL}, log disabled = ${LOG_DISABLED}`);

async function main() {
  const app = new Koa();
  const logger = getLogger();

  app.use(
    koaCors({
      origin: (ctx) => {
        if (CORS_ORIGINS.indexOf(ctx.request.header.origin) !== -1) {
          return ctx.request.header.origin;
        }
        return CORS_ORIGINS[0];
      },
      allowHeaders: ["Accept", "Content-Type", "Authorization"],
      maxAge: CORS_MAX_AGE,
    })
  );

  app.use(bodyParser());

  const router = new Router();

  router.get("/api/reviews", async (ctx) => {
    ctx.body = await reviewService.getAll();
  });

  router.post("/api/reviews", async (ctx) => {
    const newReview = await reviewService.create({
      ...ctx.request.body,
      date: new Date(ctx.request.body.date),
    });
    ctx.body = newReview;
  });

  router.get("/api/reviews/:id", async (ctx) => {
    ctx.body = await reviewService.getById(ctx.params.id);
  });

  router.put("/api/reviews/:id", async (ctx) => {
    ctx.body = await reviewService.updateById(ctx.params.id, {
      ...ctx.request.body,
      date: new Date(ctx.request.body.date),
    });
  });

  router.delete("/api/reviews/:id", async (ctx) => {
    reviewService.deleteById(ctx.params.id);
    ctx.status = 204;
  });

  /*

  - REST (REST API beschikbaar stellen) / GraphQL
  - SERVICE (business logica)
  - REPOSITORY (queries opbouwen & uitvoeren)
  - DATA (connectie met databank onderhouden)
  - DATABANK (MySQL)

*/

  app.use(router.routes()).use(router.allowedMethods());

  // GET /api/transactions -> alle transacties
  // GET /api/transactions/34 -> één specifieke transactie
  // POST /api/transactions/35 -> transactie toevoegen
  // PUT /api/transactions/35 -> transactie updaten
  // DELETE /api/transactions/35 -> transactie verwijderen

  app.listen(PORT);

  logger.info(`Server listening on ${PROTOCOL}://${HOST}:${PORT}`);
}

main();