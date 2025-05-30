import express, { Request, Response } from "express";
import { Group } from "../models/group";
import GroupSvc from "../services/group-svc";

const router = express.Router();

router.get("/", (_req, res: Response) => {
  GroupSvc.index()
    .then((list: Group[]) => res.json(list))
    .catch((err) => res.status(500).send(err));
});

router.get("/:id", (req, res: Response) => {
  GroupSvc.get(req.params.id)
    .then((g) => (g ? res.json(g) : res.status(404).end()))
    .catch(() => res.status(500).end());
});

router.post("/", (req, res: Response) => {
  GroupSvc.create(req.body)
    .then((g) => res.status(201).json(g))
    .catch((err) => res.status(500).send(err));
});

router.put("/:id", (req, res: Response) => {
  GroupSvc.update(req.params.id, req.body)
    .then((g) => (g ? res.json(g) : res.status(404).end()))
    .catch((err) => res.status(500).send(err));
});

router.delete("/:id", (req, res: Response) => {
  GroupSvc.remove(req.params.id)
    .then((g) => (g ? res.status(204).end() : res.status(404).end()))
    .catch((err) => res.status(500).send(err));
});

export default router;
