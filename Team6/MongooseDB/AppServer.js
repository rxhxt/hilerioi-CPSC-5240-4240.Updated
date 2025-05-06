"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv = require("dotenv");
var App_1 = require("./App");
dotenv.config();
var port = process.env.PORT;
var server = new App_1.App().express;
server.listen(port);
console.log("server running in port " + port);
