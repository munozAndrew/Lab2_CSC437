import { Schema, model } from "mongoose";
import { Bookmark } from "../models/bookmark";

// Mongoose schema for the Bookmark interface
const BookmarkSchema = new Schema<Bookmark>(
  {
    id:          { type: String, required: true, trim: true },
    name:        { type: String, required: true, trim: true },
    url:         { type: String, required: true },
    image:       String,
    description: String,
    tags:        [String],
    groupIds:    [String],
    createdAt:   { type: Date, default: () => new Date() },
    lastVisited: Date,
    visitCount:  { type: Number, default: 0 },
    orderIndex:  Number,
    pinned:      { type: Boolean, default: false },
  },
  { collection: "bookmarks" }
);

const BookmarkModel = model<Bookmark>("Bookmark", BookmarkSchema);

// Service functions
function index(): Promise<Bookmark[]> {
  return BookmarkModel.find().exec();
}

function get(id: string): Promise<Bookmark | null> {
  return BookmarkModel.findOne({ id }).exec();
}

// (Optional) additional CRUD operations
function create(data: Partial<Bookmark>): Promise<Bookmark> {
  return BookmarkModel.create(data as Bookmark);
}

function update(id: string, updates: Partial<Bookmark>): Promise<Bookmark | null> {
  return BookmarkModel.findOneAndUpdate({ id }, updates, { new: true }).exec();
}

function remove(id: string): Promise<Bookmark | null> {
  return BookmarkModel.findOneAndDelete({ id }).exec();
}

export default { index, get, create, update, remove };
