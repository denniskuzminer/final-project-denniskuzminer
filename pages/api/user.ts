import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "./utils/dbConnect";
import bcrypt from "bcryptjs";
import * as auth from "./utils/auth";
import User from "../../models/user";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();
  console.log(new Date(), req.method);
  const { method } = req;
  if (method == "POST") {
    const { username, password, confirmPassword } =
      typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    if (password !== confirmPassword) {
      res.status(409).send("Passwords do not match");
      return;
    }
    const check = await User.findOne({ username });
    if (check) {
      res.status(409).send("User already exists");
      return;
    }
    const hash = await bcrypt.hash(password, 10);
    const user = new User({
      username,
      hash,
      favorites: [],
      strategies: [],
      backtests: [],
    });
    await user
      .save()
      .then((data) => res.status(200).json(data))
      .catch((err) => res.status(err.status).send("Error saving user"));

    // auth.register(
    //   req.body.username,
    //   req.body.password,
    //   function (err) {
    //     return;
    //   },
    //   function (newUser) {
    //     auth.startAuthenticatedSession(req, newUser, (err) => {
    //       if (!err) {
    //         res.status(200).json(newUser);
    //       } else {
    //         res.render("error", { message: "err authing???" });
    //       }
    //     });
    //   }
    // );
  }
}
