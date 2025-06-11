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
var groups_exports = {};
__export(groups_exports, {
  default: () => groups_default
});
module.exports = __toCommonJS(groups_exports);
var import_express = __toESM(require("express"));
var import_group_svc = __toESM(require("../services/group-svc"));
const router = import_express.default.Router();
router.get("/", (_req, res) => {
  import_group_svc.default.index().then((list) => {
    res.json(list);
  }).catch((err) => {
    res.status(500).send(err);
  });
});
router.get("/:id", (req, res) => {
  import_group_svc.default.get(req.params.id).then((g) => {
    if (g) {
      res.json(g);
    } else {
      res.status(404).end();
    }
  }).catch(() => {
    res.status(500).end();
  });
});
router.post("/", (req, res) => {
  import_group_svc.default.create(req.body).then((g) => {
    res.status(201).json(g);
  }).catch((err) => {
    res.status(500).send(err);
  });
});
router.put("/:id", (req, res) => {
  import_group_svc.default.update(req.params.id, req.body).then((g) => {
    if (g) {
      res.json(g);
    } else {
      res.status(404).end();
    }
  }).catch((err) => {
    res.status(500).send(err);
  });
});
router.delete("/:id", (req, res) => {
  import_group_svc.default.remove(req.params.id).then((g) => {
    if (g) {
      res.status(204).end();
    } else {
      res.status(404).end();
    }
  }).catch((err) => {
    res.status(500).send(err);
  });
});
var groups_default = router;
