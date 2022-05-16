import express from "express";
import { json } from "body-parser";
import mongoose from "mongoose";
import cookieSession from "cookie-session";

import { errorHandler } from "@ticketing763/common";
import { currentUserRouter } from "./routes/current-user";
import { NotFoundError } from "@ticketing763/common";
import { signupRouter } from "./routes/signup";
import { signinRouter } from "./routes/signin";
import { signoutRouter } from "./routes/signout";

const app = express();
app.set("trust proxy", true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: true,
  })
);

app.use(currentUserRouter);
app.use(signupRouter);
app.use(signinRouter);
app.use(signoutRouter);

app.all("*", (req, res) => {
  throw new NotFoundError();
});
app.use(errorHandler);

const startDBConnection = async () => {
  try {
    if (!process.env.JWT_KEY) {
      throw new Error("JWT token not defined!!");
    }
    await mongoose.connect("mongodb://auth-mongo-srv:27017/auth");
    console.log("Connected to mongodb!!!");
  } catch (error: any) {
    console.log(error);
  }

  app.listen(3000, () => {
    console.log("Listening on port 3000!!!!");
  });
};

startDBConnection();
