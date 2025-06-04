// packages/server/src/routes/bookmarks.ts
import express, { Request, Response } from "express";
import { Bookmark } from "../models/bookmark";
import BookmarkSvc from "../services/bookmark-svc";

const router = express.Router();

// GET /api/bookmarks
router.get("/", (_req: Request, res: Response): void => {
  BookmarkSvc.index()
    .then((list: Bookmark[]) => {
      res.json(list);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

// GET /api/bookmarks/:id
router.get("/:id", (req: Request, res: Response): void => {
  BookmarkSvc.get(req.params.id)
    .then((bm) => {
      if (bm) {
        res.json(bm);
      } else {
        res.status(404).end();
      }
    })
    .catch(() => {
      res.status(500).end();
    });
});

// POST /api/bookmarks
router.post("/", (req: Request, res: Response): void => {
  BookmarkSvc.create(req.body)
    .then((bm) => {
      res.status(201).json(bm);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

// PUT /api/bookmarks/:id
router.put("/:id", (req: Request, res: Response): void => {
  BookmarkSvc.update(req.params.id, req.body)
    .then((bm) => {
      if (bm) {
        res.json(bm);
      } else {
        res.status(404).end();
      }
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

// DELETE /api/bookmarks/:id
router.delete("/:id", (req: Request, res: Response): void => {
  BookmarkSvc.remove(req.params.id)
    .then((bm) => {
      if (bm) {
        res.status(204).end();
      } else {
        res.status(404).end();
      }
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

export default router;
