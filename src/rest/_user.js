const Joi = require("joi");
const Router = require("@koa/router");

const userService = require("../service/user");
const Role = require("../core/roles");
const { requireAuthentication, makeRequireRole } = require("../core/auth");

const validate = require("./_validation");

//TODO: ADD SWAGGER TO LOGIN/REGISTER

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
 *                  example: "firstname.lastname@hogent.be"
 *     UserLogin:
 *       description: The user's login credentials.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                  type: string
 *                  example: "user@examples.be"
 *               password:
 *                 type: string
 *                 example: "string"
 *     UserRegister:
 *       description: The user's credentials to create an account.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                  type: string
 *                  example: "FirstName LastName"
 *               email:
 *                  type: string
 *                  example: "user@examples.be"
 *               password:
 *                 type: string
 *                 example: "string"
 */

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Login
 *     tags:
 *      - Users
 *     requestBody:
 *       $ref: "#/components/requestBodies/UserLogin"
 *     responses:
 *       200:
 *         description: Token
 */
//TODO: requestBody -> TOKEN
const login = async (ctx) => {
  const { email, password } = ctx.request.body;
  const session = await userService.login(email, password);
  ctx.body = session;
};
login.validationScheme = {
  body: {
    email: Joi.string().email(),
    password: Joi.string(),
  },
};

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Register
 *     tags:
 *      - Users
 *     requestBody:
 *       $ref: "#/components/requestBodies/UserRegister"
 *     responses:
 *       200:
 *         description: Token
 */
//TODO: requestBody -> TOKEN
const register = async (ctx) => {
  const session = await userService.register(ctx.request.body);
  ctx.body = session;
};
register.validationScheme = {
  body: {
    name: Joi.string().max(255),
    email: Joi.string().email(),
    password: Joi.string().min(8).max(30),
  },
};

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
    ctx.query.offset && Number(ctx.query.offset)
  );
  ctx.body = users;
};
getAllUsers.validationScheme = {
  query: Joi.object({
    limit: Joi.number().integer().positive().max(1000).optional(),
    offset: Joi.number().integer().min(0).optional(),
  }).and("limit", "offset"),
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
getUserById.validationScheme = {
  params: {
    id: Joi.string(),
  },
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
updateUserById.validationScheme = {
  params: {
    id: Joi.string(),
  },
  body: {
    name: Joi.string().max(255),
    email: Joi.string().email(),
  },
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
deleteUserById.validationScheme = {
  params: {
    id: Joi.string(),
  },
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

  // Public routes
  router.post("/login", validate(login.validationScheme), login);
  router.post("/register", validate(register.validationScheme), register);

  const requireAdmin = makeRequireRole(Role.ADMIN);

  // Routes with authentication/autorisation
  router.get(
    "/",
    requireAuthentication,
    requireAdmin,
    validate(getAllUsers.validationScheme),
    getAllUsers
  );
  router.get(
    "/:id",
    requireAuthentication,
    requireAdmin,
    validate(getUserById.validationScheme),
    getUserById
  );
  router.put(
    "/:id",
    requireAuthentication,
    requireAdmin,
    validate(updateUserById.validationScheme),
    updateUserById
  );
  router.delete(
    "/:id",
    requireAuthentication,
    requireAdmin,
    validate(deleteUserById.validationScheme),
    deleteUserById
  );

  app.use(router.routes()).use(router.allowedMethods());
};
