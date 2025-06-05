"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var bookmarks_exports = {};
__export(bookmarks_exports, {
  default: () => bookmarks_default
});
module.exports = __toCommonJS(bookmarks_exports);
var import_express = __toESM(require("express"));
var import_bookmark_svc = __toESM(require("../services/bookmark-svc"));
const router = import_express.default.Router();
router.get("/", (_req, res) => {
  import_bookmark_svc.default.index().then((list) => {
    res.json(list);
  }).catch((err) => {
    res.status(500).send(err);
  });
});
router.get("/:id", (req, res) => {
  import_bookmark_svc.default.get(req.params.id).then((bm) => {
    if (bm) {
      res.json(bm);
    } else {
      res.status(404).end();
    }
  }).catch(() => {
    res.status(500).end();
  });
});
router.post("/", (req, res) => {
  import_bookmark_svc.default.create(req.body).then((bm) => {
    res.status(201).json(bm);
  }).catch((err) => {
    res.status(500).send(err);
  });
});
router.put("/:id", (req, res) => {
  import_bookmark_svc.default.update(req.params.id, req.body).then((bm) => {
    if (bm) {
      res.json(bm);
    } else {
      res.status(404).end();
    }
  }).catch((err) => {
    res.status(500).send(err);
  });
});
router.delete("/:id", (req, res) => {
  import_bookmark_svc.default.remove(req.params.id).then((bm) => {
    if (bm) {
      res.status(204).end();
    } else {
      res.status(404).end();
    }
  }).catch((err) => {
    res.status(500).send(err);
  });
});
var bookmarks_default = router;
