require("dotenv").config();
const port = process.env.CLIENT_PORT || 9001;

module.exports = {
  devServer: {
    port: port
  }
};
