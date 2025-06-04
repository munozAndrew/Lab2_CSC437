// packages/server/src/routes/auth.ts
import dotenv from "dotenv";
import express, { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import credentials from "../services/credential-svc";

dotenv.config();

const TOKEN_SECRET: string = process.env.TOKEN_SECRET || "NOT_A_SECRET";

const router = express.Router();

function generateAccessToken(username: string): Promise<string> {
  return new Promise((resolve, reject) => {
    jwt.sign(
      { username },
      TOKEN_SECRET,
      { expiresIn: "1d" },
      (err, token) => {
        if (err) reject(err);
        else resolve(token as string);
      }
    );
  });
}


router.post("/register", (req: Request, res: Response): void => {
  const { username, password } = req.body;
  if (typeof username !== "string" || typeof password !== "string") {
    res.status(400).send("Bad request: Username and password must be strings.");
    return;
  }

  credentials
    .create(username, password)
    .then((savedCred) => {
      return generateAccessToken(savedCred.username);
    })
    .then((token) => {
      res.status(201).send({ token });
    })
    .catch((err) => {
      if (err instanceof Error && err.message.startsWith("Username exists")) {
        res.status(409).send({ error: err.message });
      } else {
        console.error("Error in /auth/register:", err);
        res.status(500).send({ error: "Registration failed" });
      }
    });
});


router.post("/login", (req: Request, res: Response): void => {
  const { username, password } = req.body;
  if (typeof username !== "string" || typeof password !== "string") {
    res.status(400).send("Bad request: Missing or invalid username/password.");
    return;
  }

  credentials
    .verify(username, password)
    .then((goodUser) => {
      return generateAccessToken(goodUser);
    })
    .then((token) => {
      res.status(200).send({ token });
    })
    .catch(() => {
      res.status(401).send("Unauthorized");
    });
});


export function authenticateUser(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    res.status(401).end();
    return;
  }

  jwt.verify(token, TOKEN_SECRET, (err) => {
    if (err) {
      res.status(403).end();
      return;
    }
    next();
  });
}

export default router;
