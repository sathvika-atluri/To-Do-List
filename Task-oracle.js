const Router = require("express").Router();
const Query = require("./database");

Router.get('/', (req, res) => res.send("Welcome --- Backend with Oracle Database ----- "))

module.exports = Router; 