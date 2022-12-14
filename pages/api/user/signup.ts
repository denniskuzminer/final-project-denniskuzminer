import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../utils/dbConnect";
import bcrypt from "bcryptjs";
// import * as auth from "./utils/auth";
import User from "../../../models/user";

// let bcrypt = require("bcrypt");
// let bcrypt = { hash: (...args: any) => {} };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();
  console.log(new Date(), req.method, req.url);
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
      .then((data: Array<any>) => res.status(200).json(data))
      .catch((err: any) => res.status(err.status).send("Error saving user"));
  }
}
