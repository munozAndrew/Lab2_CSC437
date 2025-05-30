import express, { Request, Response } from "express";
import { connect } from "./services/mongo";

import bookmarksRouter from "./routes/bookmarks";
import groupsRouter    from "./routes/groups";

connect("BookmarkDB");

const app = express();
const port = process.env.PORT || 3000;
const staticDir = process.env.STATIC || "public";

app.use(express.json());
app.use(express.static(staticDir));

app.get("/hello", (_req: Request, res: Response) => {
  res.send("Hello, World");
});

app.use("/api/bookmarks", bookmarksRouter);
app.use("/api/groups",    groupsRouter);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
