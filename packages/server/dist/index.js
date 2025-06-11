"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(

  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var import_express = __toESM(require("express"));
var import_mongo = require("./services/mongo");
var import_bookmarks = __toESM(require("./routes/bookmarks"));
var import_groups = __toESM(require("./routes/groups"));
var import_auth = __toESM(require("./routes/auth"));
(0, import_mongo.connect)("BookmarkDB");
const app = (0, import_express.default)();
const port = process.env.PORT || 3e3;
const staticDir = process.env.STATIC || "public";
app.use(import_express.default.json());
app.use(import_express.default.static(staticDir));
app.get("/hello", (_req, res) => {
  res.send("Hello, World");
});
app.use("/auth", import_auth.default);
app.use("/api/bookmarks", import_auth.authenticateUser, import_bookmarks.default);
app.use("/api/groups", import_auth.authenticateUser, import_groups.default);
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
