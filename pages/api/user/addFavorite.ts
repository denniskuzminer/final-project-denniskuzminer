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
  if (method == "PUT") {
    const { username, favorites } =
      typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    await User.findOneAndUpdate(
      { username },
      { favorites },
      {
        new: true,
      }
    )
      .then((data) => res.status(200).json(data))
      .catch((err) =>
        res.status(404).send(`Could not update user: ${username}`)
      );
  }
}
