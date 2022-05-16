import express, { Request, Response } from "express";
import { currentUser } from "@ticketing763/common";
// import { requireAuth } from "@ticketing763/common";
// import { requireAuth } from "../middlewares/require-auth";

const router = express.Router();

export const currentUserRouter = router.get(
  "/api/users/currentuser",
  currentUser,
  (req: Request, res: Response) => {
    res.send({ currentUser: req.currentUser || null });
  }
);
