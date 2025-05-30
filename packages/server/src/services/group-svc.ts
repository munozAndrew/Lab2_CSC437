import { Schema, model } from "mongoose";
import { Group } from "../models/group";

const GroupSchema = new Schema<Group>(
  {
    id: {
      type: String,
      required: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: String,
    bookmarkIds: {
      type: [String],
      default: [],
    },
    createdAt: {
      type: Date,
      default: () => new Date(),
    },
  },
  { collection: "groups" }
);

const GroupModel = model<Group>("Group", GroupSchema);

function index(): Promise<Group[]> {
  return GroupModel.find().exec();
}

function get(id: string): Promise<Group | null> {
  return GroupModel.findOne({ id }).exec();
}

function create(group: Partial<Group>): Promise<Group> {
  return GroupModel.create(group as Group);
}

function update(id: string, updates: Partial<Group>): Promise<Group | null> {
  return GroupModel.findOneAndUpdate({ id }, updates, { new: true }).exec();
}

function remove(id: string): Promise<Group | null> {
  return GroupModel.findOneAndDelete({ id }).exec();
}

export default { index, get, create, update, remove };
