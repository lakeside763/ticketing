import express, { Request, Response } from "express";
import { body } from "express-validator";
import jwt from "jsonwebtoken";

// import { RequestValidationError } from "../errors/request-validation-error";
// import { DatabaseConnectionError } from "../errors/database-connection-error";
import asyncHandler from "express-async-handler";
import { User } from "../models/user";
import { BadRequestError } from "@ticketing763/common";
import { validateRequest } from "@ticketing763/common";

const router = express.Router();

router.post(
  "/api/users/signup",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password").trim().isLength({ min: 4, max: 20 }).withMessage("Password must between 4 and 20 characters"),
  ],
  validateRequest,
  asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new BadRequestError(email + " already exists");
    }

    const user = new User({
      email,
      password,
    });

    await user.save();

    // Generate JWT
    const userJwt = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_KEY!
    );

    // Store
    req.session = { jwt: userJwt };
    const mapUser = () => ({ id: user._id, email: user.email });

    res.status(201).send(mapUser());
  })
);

export { router as signupRouter };
