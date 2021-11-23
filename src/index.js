const Koa = require("koa");
const config = require("config");
const koaCors = require("@koa/cors");
const bodyParser = require("koa-bodyparser");
const { initializeLogger, getLogger } = require("./core/logging");
const { initializeData } = require("./data");
const installRest = require("./rest");

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
  initializeLogger({
    level: LOG_LEVEL,
    disabled: LOG_DISABLED,
    isProduction: NODE_ENV === "production",
    defaultMeta: { NODE_ENV },
  });

  await initializeData();

  const app = new Koa();

  //CORS
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

  const logger = getLogger();
  app.use(bodyParser());

  installRest(app);

  /*

  - REST (REST API beschikbaar stellen) / GraphQL
  - SERVICE (business logica)
  - REPOSITORY (queries opbouwen & uitvoeren)
  - DATA (connectie met databank onderhouden)
  - DATABANK (MySQL)

*/

  // GET /api/transactions -> alle transacties
  // GET /api/transactions/34 -> één specifieke transactie
  // POST /api/transactions/35 -> transactie toevoegen
  // PUT /api/transactions/35 -> transactie updaten
  // DELETE /api/transactions/35 -> transactie verwijderen

  app.listen(PORT);

  logger.info(`Server listening on ${PROTOCOL}://${HOST}:${PORT}`);
}

main();
