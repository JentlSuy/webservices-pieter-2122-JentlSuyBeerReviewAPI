const Router = require("@koa/router");

const userService = require("../service/user");

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Represents a user.
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
 *     UsersList:
 *       allOf:
 *         - $ref: "#/components/schemas/ListResponse"
 *         - type: object
 *           required:
 *             - data
 *           properties:
 *             data:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/User"
 *   requestBodies:
 *     User:
 *       description: The user's info to save.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "FirstName LastName"
 *               email:
 *                  type: string
 *                  example: "firstname.lastname@shogent.be"
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users (paginated)
 *     tags:
 *      - Users
 *     parameters:
 *       - $ref: "#/components/parameters/limitParam"
 *       - $ref: "#/components/parameters/offsetParam"
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/UsersList"
 */
const getAllUsers = async (ctx) => {
  const users = await userService.getAll(
    ctx.query.limit && Number(ctx.query.limit),
    ctx.query.offset && Number(ctx.query.offset),
  );
  ctx.body = users;
};

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get a user with the given id
 *     tags:
 *      - Users
 *     parameters:
 *       - name: id
 *         in: path
 *         description: id of the user
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: User with the given id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/User"
 */
const getUserById = async (ctx) => {
  const user = await userService.getById(ctx.params.id);
  ctx.body = user;
};

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Update a user
 *     description: Updates a user.
 *     tags:
 *      - Users
 *     parameters:
 *       - name: id
 *         in: path
 *         description: id of the review
 *         required: true
 *         type: string
 *     requestBody:
 *       $ref: "#/components/requestBodies/User"
 *     responses:
 *       200:
 *         description: The updated user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/User"
 */
const updateUserById = async (ctx) => {
  const user = await userService.updateById(ctx.params.id, ctx.request.body);
  ctx.body = user;
};

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Delete a uesr with the given id
 *     tags:
 *      - Users
 *     parameters:
 *       - name: id
 *         in: path
 *         description: id of the user
 *         required: true
 *         type: string
 *     responses:
 *       204:
 *         description: No Content
 */
const deleteUserById = async (ctx) => {
  await userService.deleteById(ctx.params.id);
  ctx.status = 204;
};

/**
 * Install user routes in the given router.
 *
 * @param {Router} app - The parent router.
 */
module.exports = function installUsersRoutes(app) {
  const router = new Router({
    prefix: "/users",
  });

  router.get("/", getAllUsers);
  router.get("/:id", getUserById);
  router.put("/:id", updateUserById);
  router.delete("/:id", deleteUserById);

  app.use(router.routes()).use(router.allowedMethods());
};
