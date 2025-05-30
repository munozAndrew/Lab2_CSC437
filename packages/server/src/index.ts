import express, { Request, Response } from "express";
import { connect } from "./services/mongo";
import BookmarkSvc from "./services/bookmark-svc";
import GroupSvc from "./services/group-svc";

connect("BookmarkDB");                // your Atlas DB name

const app = express();
const port = process.env.PORT || 3000;
const staticDir = process.env.STATIC || "public";

// JSON body parser (for future POST/PUT routes)
app.use(express.json());

// Serve your proto frontend
app.use(express.static(staticDir));

// Simple test route
app.get("/hello", (_req: Request, res: Response) => {
  res.send("Hello, World");
});

// ---- Bookmark routes ----
// GET all bookmarks
app.get("/bookmarks", (_req, res) => {
  BookmarkSvc.index().then((list) => res.json(list));
});

// GET one bookmark by id
app.get("/bookmarks/:id", (req, res) => {
  BookmarkSvc.get(req.params.id).then((bm) => {
    if (bm) res.json(bm);
    else res.status(404).send();
  });
});

// ---- Group routes ----
// GET all groups
app.get("/groups", (_req, res) => {
  GroupSvc.index().then((list) => res.json(list));
});

// GET one group by id
app.get("/groups/:id", (req, res) => {
  GroupSvc.get(req.params.id).then((grp) => {
    if (grp) res.json(grp);
    else res.status(404).send();
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
