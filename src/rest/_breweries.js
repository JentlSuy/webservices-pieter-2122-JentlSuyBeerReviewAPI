const Router = require("@koa/router");

const breweryService = require("../service/brewery");

/**
 * @swagger
 * tags:
 *   name: Breweries
 *   description: Represents the brewery of where a beer is brewed.
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
 *     Brewery:
 *       allOf:
 *         - $ref: "#/components/schemas/Base"
 *         - type: object
 *           required:
 *             - name
 *             - country
 *           properties:
 *             name:
 *               type: "string"
 *             country:
 *               type: "string"
 *           example:
 *             $ref: "#/components/examples/Brewery"
 *     BreweriesList:
 *       allOf:
 *         - $ref: "#/components/schemas/ListResponse"
 *         - type: object
 *           required:
 *             - data
 *           properties:
 *             data:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/Brewery"
 *   examples:
 *     Brewery:
 *       id: "7f28c5f9-d711-4cd6-ac15-d13d71abbr03"
 *       name: "Abdij van Westmalle"
 *       country: "Belgium"
 *   requestBodies:
 *     Brewery:
 *       description: The brewery's info to save.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "The name of the brewery."
 *               country:
 *                 type: string
 *                 example: "The country of where the brewery is located."
 */

/**
 * @swagger
 * /api/breweries:
 *   get:
 *     summary: Get all breweries (paginated)
 *     tags:
 *      - Breweries
 *     parameters:
 *       - $ref: "#/components/parameters/limitParam"
 *       - $ref: "#/components/parameters/offsetParam"
 *     responses:
 *       200:
 *         description: List of breweries
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/BreweriesList"
 */
const getAllBreweries = async (ctx) => {
  const limit = ctx.query.limit && Number(ctx.query.limit);
  const offset = ctx.query.offset && Number(ctx.query.offset);
  ctx.body = await breweryService.getAll(limit, offset);
};

/**
 * @swagger
 * /api/breweries:
 *   post:
 *     summary: Create a new brewery
 *     description: Creates a new brewery.
 *     tags:
 *      - Breweries
 *     requestBody:
 *       $ref: "#/components/requestBodies/Brewery"
 *     responses:
 *       201:
 *         description: The created brewery
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Brewery"
 */
const createBrewery = async (ctx) => {
  const newBeer = await breweryService.create(ctx.request.body);
  ctx.body = newBeer;
  ctx.status = 201;
};

/**
 * @swagger
 * /api/breweries/{id}:
 *   get:
 *     summary: Get a brewery with the given id
 *     tags:
 *      - Breweries
 *     parameters:
 *       - name: id
 *         in: path
 *         description: id of the brewery
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Brewery with the given id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Brewery"
 */
const getBreweryById = async (ctx) => {
  ctx.body = await breweryService.getById(ctx.params.id);
};

/**
 * @swagger
 * /api/breweries/{id}:
 *   put:
 *     summary: Update a brewery
 *     description: Updates a brewery.
 *     tags:
 *      - Breweries
 *     parameters:
 *       - name: id
 *         in: path
 *         description: id of the brewery
 *         required: true
 *         type: string
 *     requestBody:
 *       $ref: "#/components/requestBodies/Brewery"
 *     responses:
 *       200:
 *         description: The updated brewery
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Brewery"
 */
const updateBrewery = async (ctx) => {
  ctx.body = await breweryService.updateById(ctx.params.id, ctx.request.body);
};

/**
 * @swagger
 * /api/breweries/{id}:
 *   delete:
 *     summary: Delete a brewery with the given id
 *     tags:
 *      - Breweries
 *     parameters:
 *       - name: id
 *         in: path
 *         description: id of the brewery
 *         required: true
 *         type: string
 *     responses:
 *       204:
 *         description: No Content
 */
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
