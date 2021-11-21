module.exports = {
  log: {
    level: "silly",
    disabled: false,
  },
  cors: {
    origins: ["http://localhost:9000"],
    maxAge: 3 * 60 * 60,
  },
};
