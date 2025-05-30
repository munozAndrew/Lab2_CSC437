import express, { Request, Response } from "express";
import { connect } from "./services/mongo";
import BookmarkSvc from "./services/bookmark-svc";
import GroupSvc from "./services/group-svc";

connect("BookmarkDB");

const app = express();
const port = process.env.PORT || 3000;
const staticDir = process.env.STATIC || "public";

app.use(express.json());

app.use(express.static(staticDir));

app.get("/hello", (_req: Request, res: Response) => {
  res.send("Hello, World");
});

app.get("/bookmarks", (_req, res) => {
  BookmarkSvc.index().then((list) => res.json(list));
});

app.get("/bookmarks/:id", (req, res) => {
  BookmarkSvc.get(req.params.id).then((bm) => {
    if (bm) res.json(bm);
    else res.status(404).send();
  });
});

app.get("/groups", (_req, res) => {
  GroupSvc.index().then((list) => res.json(list));
});

app.get("/groups/:id", (req, res) => {
  GroupSvc.get(req.params.id).then((grp) => {
    if (grp) res.json(grp);
    else res.status(404).send();
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
