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
var bookmark_svc_exports = {};
__export(bookmark_svc_exports, {
  default: () => bookmark_svc_default
});
module.exports = __toCommonJS(bookmark_svc_exports);
var import_mongoose = require("mongoose");
const BookmarkSchema = new import_mongoose.Schema(
  {
    id: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    url: { type: String, required: true },
    image: String,
    description: String,
    tags: [String],
    groupIds: [String],
    createdAt: { type: Date, default: () => /* @__PURE__ */ new Date() },
    lastVisited: Date,
    visitCount: { type: Number, default: 0 },
    orderIndex: Number,
    pinned: { type: Boolean, default: false }
  },
  { collection: "bookmarks" }
);
const BookmarkModel = (0, import_mongoose.model)("Bookmark", BookmarkSchema);
function index() {
  return BookmarkModel.find().exec();
}
function get(id) {
  return BookmarkModel.findOne({ id }).exec();
}
function create(data) {
  return BookmarkModel.create(data);
}
function update(id, updates) {
  return BookmarkModel.findOneAndUpdate({ id }, updates, { new: true }).exec();
}
function remove(id) {
  return BookmarkModel.findOneAndDelete({ id }).exec();
}
var bookmark_svc_default = { index, get, create, update, remove };
