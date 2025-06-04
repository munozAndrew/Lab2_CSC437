// packages/server/src/services/credential-svc.ts
import bcrypt from "bcryptjs";
import { Schema, model } from "mongoose";
import { Credential } from "../models/credential";

const credentialSchema = new Schema<Credential>(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    hashedPassword: {
      type: String,
      required: true,
    },
  },
  { collection: "user_credentials" }
);

const credentialModel = model<Credential>("Credential", credentialSchema);

function create(username: string, password: string): Promise<Credential> {
  return credentialModel
    .find({ username })
    .then((found: Credential[]) => {
      if (found.length > 0) {
        throw new Error(`Username exists: ${username}`);
      }
    })
    .then(() => bcrypt.genSalt(10))
    .then((salt: string) => bcrypt.hash(password, salt))
    .then((hashed: string) => {
      const creds = new credentialModel({
        username,
        hashedPassword: hashed,
      });
      return creds.save();
    });
}

function verify(username: string, password: string): Promise<string> {
  return credentialModel
    .find({ username })
    .then((found: Credential[]) => {
      if (!found || found.length !== 1) {
        throw new Error("Invalid username or password");
      }
      return found[0];
    })
    .then((credsOnFile: Credential) =>
      bcrypt
        .compare(password, credsOnFile.hashedPassword)
        .then((result: boolean) => {
          if (!result) {
            throw new Error("Invalid username or password");
          }
          return credsOnFile.username;
        })
    );
}

export default { create, verify };
