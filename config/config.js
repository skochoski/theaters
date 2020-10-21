const env = process.env.NODE_ENV || "development";

const config = {
  development: {
    port: process.env.PORT || 5500,
    dbUrl: "mongodb://localhost:27017/",
    cookie: "x-auth-token",
    secret: "my-secret-secret",
  },
  production: {},
};

module.exports = config[env];
