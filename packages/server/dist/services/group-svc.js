"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var group_svc_exports = {};
__export(group_svc_exports, {
  default: () => group_svc_default
});
module.exports = __toCommonJS(group_svc_exports);
var import_mongoose = require("mongoose");
const GroupSchema = new import_mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      trim: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: String,
    bookmarkIds: {
      type: [String],
      default: []
    },
    createdAt: {
      type: Date,
      default: () => new Date()
    }
  },
  { collection: "groups" }
);
const GroupModel = (0, import_mongoose.model)("Group", GroupSchema);
function index() {
  return GroupModel.find().exec();
}
function get(id) {
  return GroupModel.findOne({ id }).exec();
}
function create(group) {
  return GroupModel.create(group);
}
function update(id, updates) {
  return GroupModel.findOneAndUpdate({ id }, updates, { new: true }).exec();
}
function remove(id) {
  return GroupModel.findOneAndDelete({ id }).exec();
}
var group_svc_default = { index, get, create, update, remove };
