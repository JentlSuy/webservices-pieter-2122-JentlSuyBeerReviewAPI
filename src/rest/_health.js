const Router = require("@koa/router");

const healthService = require("../service/health");

const validate = require("./_validation");

/**
 * @swagger
 * tags:
 *   name: Health
 *   description: Represents the health of the API.
 */

/**
 * @swagger
 * components:
 *   responses:
 *     404NotFound:
 *       description: The request resource could not be found
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *               - details
 *             properties:
 *               code:
 *                 type: string
 *               details:
 *                 type: string
 *                 description: Extra information about the specific not found error that occured
 *               stack:
 *                 type: string
 *                 description: Stack trace (only available if set in configuration)
 *             example:
 *               code: "NOT_FOUND"
 *               details: "No user with the id 99dada36-de4a-42ba-b329-3b1d88778c72 exists"
 *   schemas:
 *     Ping:
 *       allOf:
 *         - type: object
 *           properties:
 *             pong:
 *               type: "string"
 *           example:
 *             $ref: "#/components/examples/Ping"
 *     Version:
 *       allOf:
 *         - type: object
 *           properties:
 *             env:
 *               type: "string"
 *             version:
 *               type: "string"
 *             name:
 *               type: "string"
 *           example:
 *             $ref: "#/components/examples/Version"
 *   examples:
 *     Ping:
 *       pong: true
 *     Version:
 *       env: "The environment of the API"
 *       version: "The build number of the API"
 *       name: "The name of the API"
 */

/**
 * @swagger
 * /api/health/ping:
 *   get:
 *     summary: Verifies a connection with the API
 *     tags:
 *      - Health
 *     responses:
 *       200:
 *         description: Verification of a connectino with the API
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Ping"
 */
const ping = async (ctx) => {
  ctx.body = healthService.ping();
};
ping.validationScheme = null;

/**
 * @swagger
 * /api/health/version:
 *   get:
 *     summary: Shows the version the API
 *     tags:
 *      - Health
 *     responses:
 *       200:
 *         description: Shows the environment, version and name of the API
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Version"
 */
const getVersion = async (ctx) => {
  ctx.body = healthService.getVersion();
};
getVersion.validationScheme = null;

/**
 * Install health routes in the given router.
 *
 * @param {Router} app - The parent router.
 */
module.exports = function installPlacesRoutes(app) {
  const router = new Router({
    prefix: "/health",
  });

  router.get("/ping", validate(ping.validationScheme), ping);
  router.get("/version", validate(getVersion.validationScheme), getVersion);

  app.use(router.routes()).use(router.allowedMethods());
};
