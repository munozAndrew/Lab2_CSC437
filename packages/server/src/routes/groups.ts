// packages/server/src/routes/groups.ts
import express, { Request, Response } from "express";
import { Group } from "../models/group";
import GroupSvc from "../services/group-svc";

const router = express.Router();

// GET /api/groups
router.get("/", (_req: Request, res: Response): void => {
  GroupSvc.index()
    .then((list: Group[]) => {
      res.json(list);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

// GET /api/groups/:id
router.get("/:id", (req: Request, res: Response): void => {
  GroupSvc.get(req.params.id)
    .then((g) => {
      if (g) {
        res.json(g);
      } else {
        res.status(404).end();
      }
    })
    .catch(() => {
      res.status(500).end();
    });
});

// POST /api/groups
router.post("/", (req: Request, res: Response): void => {
  GroupSvc.create(req.body)
    .then((g) => {
      res.status(201).json(g);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

// PUT /api/groups/:id
router.put("/:id", (req: Request, res: Response): void => {
  GroupSvc.update(req.params.id, req.body)
    .then((g) => {
      if (g) {
        res.json(g);
      } else {
        res.status(404).end();
      }
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

// DELETE /api/groups/:id
router.delete("/:id", (req: Request, res: Response): void => {
  GroupSvc.remove(req.params.id)
    .then((g) => {
      if (g) {
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
