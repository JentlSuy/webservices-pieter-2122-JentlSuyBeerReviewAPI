module.exports = {
  definition: {
    openapi: "3.0.0",
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
    securityDefinitions: {
      bearerAuth: {
        security: [{ bearerAuth: [] }],
        type: "apiKey",
        scheme: "bearer",
        in: "header",
      },
    },
    servers: [
      {
        url: "http://localhost:9000/",
      },
    ],
  },
  apis: ["./src/rest/*.js"],
};