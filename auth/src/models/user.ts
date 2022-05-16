import mongoose from "mongoose";
import { Password } from "./../services/password";

// An interface that describes the properties
// that are required to create a new user

interface UserAttrs {
  email: string;
  password: string;
}

const userSchema = new mongoose.Schema<UserAttrs>({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

userSchema.pre("save", async function (done) {
  if (this.isModified("password")) {
    const hashed = await Password.toHash(this.get("password"));
    this.set("password", hashed);
  }
});

const User = mongoose.model<UserAttrs>("User", userSchema);

// const buildUser = (attrs: UserAttrs) => {
//   return new User(attrs)
// };

// buildUser({
//   email: 'test@test.com',
//   password: 'password',
// });

export { User };
