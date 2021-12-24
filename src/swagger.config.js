module.exports = {
  definition: {
    openapi: "3.0.1",
    info: {
      title: "BeerReview API with Swagger",
      version: "0.1.0",
      description:
        "This is a simple CRUD API application made with Koa and documented with Swagger",
      license: {
        name: "MIT",
        url: "https://spdx.org/licenses/MIT.html",
      },
      contact: {
        name: "BeerReviewAPI",
        url: "https://jentlsuy-portfolio.azurewebsites.net",
        email: "jentl.suy@student.hogent.be",
      },
    },
    servers: [
      {
        url: "ERROR-url-should-be-created-in-createServer.js",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./src/rest/*.js"],
};
