const Router = require("@koa/router");

const reviewService = require("../service/review");

/**
 * @swagger
 * tags:
 *   name: Reviews
 *   description: Represents a review of a beer, created by a user.
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
 *     Review:
 *       allOf:
 *         - $ref: "#/components/schemas/Base"
 *         - type: object
 *           required:
 *             - rating
 *             - description
 *             - date
 *             - beerId
 *             - userId
 *           properties:
 *             rating:
 *               type: "integer"
 *             discription:
 *               type: "string"
 *             date:
 *               type: "string"
 *               format: date-time
 *             beerId:
 *               type: "string"
 *             userId:
 *               type: "string"
 *           example:
 *             $ref: "#/components/examples/Review"
 *     ReviewsList:
 *       allOf:
 *         - $ref: "#/components/schemas/ListResponse"
 *         - type: object
 *           required:
 *             - data
 *           properties:
 *             data:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/Review"
 *   examples:
 *     Review:
 *       id: "7b25d1fc-a15c-49bd-8d3f-6365bfa1ca04"
 *       rating: 5
 *       description: "Lekker biertje. Blond met een kruidige nasmaak."
 *       date: "2021-05-28T14:27:32.534Z"
 *       beerId: "7f28c5f9-d711-4cd6-ac15-d13d71abbe01"
 *       user: "7f28c5f9-d711-4cd6-ac15-d13d71abus01"
 *   requestBodies:
 *     Review:
 *       description: The review info to save.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: integer
 *                 example: 5
 *               description:
 *                 type: string
 *                 example: "This is the description of my review."
 *               date:
 *                 type: string
 *                 format: "date-time"
 *               beerId:
 *                 type: string
 *                 format: uuid
 *                 example: "7f28c5f9-d711-4cd6-ac15-d13d71abbe01"
 *               userId:
 *                 type: string
 *                 format: uuid
 *                 example: "7f28c5f9-d711-4cd6-ac15-d13d71abus01"
 */

/**
 * @swagger
 * /api/reviews:
 *   get:
 *     summary: Get all reviews (paginated)
 *     tags:
 *      - Reviews
 *     parameters:
 *       - $ref: "#/components/parameters/limitParam"
 *       - $ref: "#/components/parameters/offsetParam"
 *     responses:
 *       200:
 *         description: List of reviews
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ReviewsList"
 */
const getAllReviews = async (ctx) => {
  const limit = ctx.query.limit && Number(ctx.query.limit);
  const offset = ctx.query.offset && Number(ctx.query.offset);
  ctx.body = await reviewService.getAll(limit, offset);
};

/**
 * @swagger
 * /api/reviews:
 *   post:
 *     summary: Create a new review
 *     description: Creates a new review for the signed in user.
 *     tags:
 *      - Reviews
 *     requestBody:
 *       $ref: "#/components/requestBodies/Review"
 *     responses:
 *       201:
 *         description: The created review
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Review"
 */
const createReview = async (ctx) => {
  const newReview = await reviewService.create({
    ...ctx.request.body,
    date: new Date(ctx.request.body.date),
  });
  ctx.body = newReview;
  ctx.status = 201;
};

/**
 * @swagger
 * /api/reviews/{id}:
 *   get:
 *     summary: Get a review with the given id
 *     tags:
 *      - Reviews
 *     parameters:
 *       - name: id
 *         in: path
 *         description: id of the review
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Review with the given id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Review"
 */
const getReviewById = async (ctx) => {
  ctx.body = await reviewService.getById(ctx.params.id);
};

/**
 * @swagger
 * /api/reviews/{id}:
 *   put:
 *     summary: Update a review
 *     description: Updates a review for the signed in user.
 *     tags:
 *      - Reviews
 *     parameters:
 *       - name: id
 *         in: path
 *         description: id of the review
 *         required: true
 *         type: string
 *     requestBody:
 *       $ref: "#/components/requestBodies/Review"
 *     responses:
 *       200:
 *         description: The updated review
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Review"
 */
const updateReview = async (ctx) => {
  ctx.body = await reviewService.updateById(ctx.params.id, {
    ...ctx.request.body,
    date: new Date(ctx.request.body.date),
  });
};

/**
 * @swagger
 * /api/reviews/{id}:
 *   delete:
 *     summary: Delete a review with the given id
 *     tags:
 *      - Reviews
 *     parameters:
 *       - name: id
 *         in: path
 *         description: id of the review
 *         required: true
 *         type: string
 *     responses:
 *       204:
 *         description: No Content
 */
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
