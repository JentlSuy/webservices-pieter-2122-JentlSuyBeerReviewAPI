const Joi = require("joi");
const Router = require("@koa/router");

const beerService = require("../service/beer");
const { requireAuthentication } = require("../core/auth");

const validate = require("./_validation.js");

/**
 * @swagger
 * tags:
 *   name: Beers
 *   description: Represents a beer that can be reviewed by a user.
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
 *     Beer:
 *       allOf:
 *         - $ref: "#/components/schemas/Base"
 *         - type: object
 *           required:
 *             - name
 *             - brewery_id
 *             - percentage
 *           properties:
 *             name:
 *               type: "string"
 *             brewery_id:
 *               type: "string"
 *             percantage:
 *               type: "double"
 *           example:
 *             $ref: "#/components/examples/Beer"
 *     BeersList:
 *       allOf:
 *         - $ref: "#/components/schemas/ListResponse"
 *         - type: object
 *           required:
 *             - data
 *           properties:
 *             data:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/Beer"
 *   examples:
 *     Beer:
 *       id: "7f28c5f9-d711-4cd6-ac15-d13d71abbe01"
 *       name: "Carlsberg"
 *       brewery_id: "7f28c5f9-d711-4cd6-ac15-d13d71abbr01"
 *       percentage: 5.5
 *   requestBodies:
 *     Beer:
 *       description: The beer's info to save.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "This is the name of the beer."
 *               brewery_id:
 *                 type: string
 *                 example: "7f28c5f9-d711-4cd6-ac15-d13d71abbr01"
 *               percentage:
 *                 type: double
 *                 example: 5.5
 */

/**
 * @swagger
 * /api/beers:
 *   get:
 *     summary: Get all beers (paginated)
 *     tags:
 *      - Beers
 *     parameters:
 *       - $ref: "#/components/parameters/limitParam"
 *       - $ref: "#/components/parameters/offsetParam"
 *     responses:
 *       200:
 *         description: List of beers
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/BeersList"
 */
const getAllBeers = async (ctx) => {
  const limit = ctx.query.limit && Number(ctx.query.limit);
  const offset = ctx.query.offset && Number(ctx.query.offset);
  ctx.body = await beerService.getAll(limit, offset);
};
getAllBeers.validationScheme = {
  query: Joi.object({
    limit: Joi.number().integer().positive().max(1000).optional(),
    offset: Joi.number().integer().min(0).optional(),
  }).and("limit", "offset"),
};

/**
 * @swagger
 * /api/beers:
 *   post:
 *     summary: Create a new beer
 *     description: Creates a new beer.
 *     tags:
 *      - Beers
 *     requestBody:
 *       $ref: "#/components/requestBodies/Beer"
 *     responses:
 *       201:
 *         description: The created beer
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Beer"
 */
const createBeer = async (ctx) => {
  if (ctx.request.body.percentage < 0 || ctx.request.body.percentage > 100) {
    ctx.status = 500;
  } else {
    ctx.status = 201;
  }
  const newBeer = await beerService.create(ctx.request.body);
  ctx.body = newBeer;
};
createBeer.validationScheme = {
  body: {
    name: Joi.string().max(255),
    brewery_id: Joi.string(),
    percentage: Joi.number().min(0).max(100),
  },
};

/**
 * @swagger
 * /api/beers/{id}:
 *   get:
 *     summary: Get a beer with the given id
 *     tags:
 *      - Beers
 *     parameters:
 *       - name: id
 *         in: path
 *         description: id of the beer
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Beer with the given id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Beer"
 */
const getBeerById = async (ctx) => {
  ctx.body = await beerService.getById(ctx.params.id);
};
getBeerById.validationScheme = {
  params: {
    id: Joi.string().uuid(),
  },
};

/**
 * @swagger
 * /api/beers/{id}:
 *   put:
 *     summary: Update a beer
 *     description: Updates a beer.
 *     tags:
 *      - Beers
 *     parameters:
 *       - name: id
 *         in: path
 *         description: id of the beer
 *         required: true
 *         type: string
 *     requestBody:
 *       $ref: "#/components/requestBodies/Beer"
 *     responses:
 *       200:
 *         description: The updated beer
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Beer"
 */
const updateBeer = async (ctx) => {
  ctx.body = await beerService.updateById(ctx.params.id, ctx.request.body);
};
updateBeer.validationScheme = {
  params: {
    id: Joi.string(),
  },
  body: {
    name: Joi.string().max(255),
    brewery_id: Joi.string(),
    percentage: Joi.number().min(0).max(100),
  },
};

/**
 * @swagger
 * /api/beers/{id}:
 *   delete:
 *     summary: Delete a beer with the given id
 *     tags:
 *      - Beers
 *     parameters:
 *       - name: id
 *         in: path
 *         description: id of the beer
 *         required: true
 *         type: string
 *     responses:
 *       204:
 *         description: No Content
 */
const deleteBeer = async (ctx) => {
  await beerService.deleteById(ctx.params.id);
  ctx.status = 204;
};
deleteBeer.validationScheme = {
  params: {
    id: Joi.string(),
  },
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

  router.get(
    "/",
    requireAuthentication,
    validate(getAllBeers.validationScheme),
    getAllBeers
  );
  router.post(
    "/",
    requireAuthentication,
    validate(createBeer.validationScheme),
    createBeer
  );
  router.get(
    "/:id",
    requireAuthentication,
    validate(getBeerById.validationScheme),
    getBeerById
  );
  router.put(
    "/:id",
    requireAuthentication,
    validate(updateBeer.validationScheme),
    updateBeer
  );
  router.delete(
    "/:id",
    requireAuthentication,
    validate(deleteBeer.validationScheme),
    deleteBeer
  );

  app.use(router.routes()).use(router.allowedMethods());
};
