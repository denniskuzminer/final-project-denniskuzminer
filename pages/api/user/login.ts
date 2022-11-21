import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../utils/dbConnect";
import bcrypt from "bcryptjs";
// import * as auth from "./utils/auth";
import User from "../../../models/user";

// let bcrypt = require("bcrypt");
// let bcrypt = { compare: (...args: any) => {} };
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();
  console.log(new Date(), req.method, req.url);
  const { method } = req;
  if (method == "POST") {
    const { username, password } =
      typeof req.body === "string" ? JSON.parse(req.body) : req.body;

    const user = await User.findOne({ username });
    if (!user) {
      res.status(409).send("Username does not exist");
      return;
    }
    bcrypt.compare(password, user.hash, (err: any, passwordMatch: any) => {
      if (passwordMatch) {
        res.status(200).json(user);
      } else {
        res.status(409).send("Incorrect password");
      }
    });

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
