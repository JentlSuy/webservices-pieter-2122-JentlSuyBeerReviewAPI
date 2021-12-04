const Router = require("@koa/router");

const installReviewRouter = require("./_reviews");
const installHealthRouter = require("./_health");
const installBreweryRouter = require("./_breweries");
const installBeerRouter = require("./_beers");
const installUserRouter = require("./_user");

/**
 * @swagger
 * components:
 *   parameters:
 *     limitParam:
 *       in: query
 *       name: limit
 *       description: Maximum amount of items to return
 *       required: false
 *       schema:
 *         type: integer
 *         default: 100
 *     offsetParam:
 *       in: query
 *       name: offset
 *       description: Number of items to skip
 *       required: false
 *       schema:
 *         type: integer
 *         default: 0
 *     reviewIdParam:
 *       in: path
 *       name: reviewId
 *       description: UUID4 - id of the review
 *       required: true
 *       type: string
 *   schemas:
 *     Base:
 *       required:
 *         - id
 *       properties:
 *         id:
 *           type: string
 *           format: "uuid"
 *       example:
 *         id: "6d560fca-e7f9-4583-af2d-b05ccd1a0c58"
 *     ListResponse:
 *       required:
 *         - count
 *         - limit
 *         - offset
 *       properties:
 *         count:
 *           type: integer
 *           description: Number of items returned
 *           example: 1
 *         limit:
 *           type: integer
 *           description: Limit actually used
 *           example: 1
 *         offset:
 *           type: integer
 *           description: Offset actually used
 *           example: 1
 *     User:
 *       allOf:
 *         - $ref: "#/components/schemas/Base"
 *         - type: object
 *           required:
 *             - name
 *           properties:
 *             name:
 *               type: "string"
 *             email:
 *               type: "string"
 *               format: email
 *           example:
 *             $ref: "#/components/examples/User"
 *   examples:
 *     User:
 *       id: "7f28c5f9-d711-4cd6-ac15-d13d71abus01"
 *       name: "FirstName LastName"
 *       email: "firstname.lastname@shogent.be"
 */

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
  installBreweryRouter(router);
  installBeerRouter(router);
  installHealthRouter(router);
  installUserRouter(router);

  app.use(router.routes()).use(router.allowedMethods());
};
