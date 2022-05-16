import express, { Request, Response } from "express";
import { body } from "express-validator";
import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";

import { Password } from "../services/password";
import { User } from "../models/user";
import { validateRequest } from "@ticketing763/common";
import { BadRequestError } from "@ticketing763/common";

const router = express.Router();

export const signinRouter = router.post(
  "/api/users/signin",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password").trim().notEmpty().withMessage("You must supply a password"),
  ],
  validateRequest,
  asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      throw new BadRequestError("Invalid credentials");
    }

    const passwordsMatch = await Password.compare(existingUser.password, password);

    if (!passwordsMatch) throw new BadRequestError("Invalid password");

    // Generate JWT
    const userJwt = jwt.sign(
      {
        id: existingUser.id,
        email: existingUser.email,
      },
      process.env.JWT_KEY!
    );

    // Store
    req.session = { jwt: userJwt };
    const mapUser = () => ({ id: existingUser._id, email: existingUser.email });

    res.status(201).send(mapUser());
  })
);
