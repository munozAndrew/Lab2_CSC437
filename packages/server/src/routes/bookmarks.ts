import express, { Request, Response } from "express";
import { Bookmark } from "../models/bookmark";
import BookmarkSvc from "../services/bookmark-svc";

const router = express.Router();


router.get("/", (_req, res: Response) => {
  BookmarkSvc.index()
    .then((list: Bookmark[]) => res.json(list))
    .catch((err) => res.status(500).send(err));
});

router.get("/:id", (req, res: Response) => {
  BookmarkSvc.get(req.params.id)
    .then((bm) => (bm ? res.json(bm) : res.status(404).end()))
    .catch(() => res.status(500).end());
});

router.post("/", (req, res: Response) => {
  BookmarkSvc.create(req.body)
    .then((bm) => res.status(201).json(bm))
    .catch((err) => res.status(500).send(err));
});

router.put("/:id", (req, res: Response) => {
  BookmarkSvc.update(req.params.id, req.body)
    .then((bm) => (bm ? res.json(bm) : res.status(404).end()))
    .catch((err) => res.status(500).send(err));
});

router.delete("/:id", (req, res: Response) => {
  BookmarkSvc.remove(req.params.id)
    .then((bm) => (bm ? res.status(204).end() : res.status(404).end()))
    .catch((err) => res.status(500).send(err));
});

export default router;
