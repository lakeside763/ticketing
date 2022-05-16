import express, { Request, Response} from 'express';

const router = express.Router();

export const signoutRouter = router.post("/api/users/signout", (req: Request, res: Response) => {
  req.session = null;

  res.send({});
});

