module.exports = {
  log: {
    level: "silly",
    disabled: true,
  },
  cors: {
    origins: ["http://localhost:3000"],
    maxAge: 3 * 60 * 60,
  },
  database: {
    client: "mysql2",
    host: "localhost",
    port: 3306,
    name: "beerreview_test",
    username: "root",
    password: "root"
  },
  pagination: {
    limit: 100,
    offset: 0,
  },
};
