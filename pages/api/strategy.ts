import dbConnect from "./utils/dbConnect";
import Strategy from "../../models/strategy";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await dbConnect();
    console.log(new Date(), req.method);
    if (req.method === "POST") {
      const newStrategy = new Strategy(
        typeof req.body === "string" ? JSON.parse(req.body) : req.body
      );
      const test = await newStrategy.save();
      res.status(200).json(test);
    } else if (req.method === "GET") {
      const allStrats = await Strategy.find({});
      res.status(200).json(allStrats);
    } else if (req.method === "PUT") {
      // Strategy.findByIdAndUpdate()
    }
  } catch (error) {
    console.log(error);
    res.json({ error });
  }
}

// {
//   "name": "String",
//   "principal": 10,
//   "condition": "string",
//   "actionIf": "Action",
//   "actionElse": "Action",
//   "on": "string",
//   "per": "string",
//   "startDate": "10/10/2001",
//   "endDate": "10/10/2001",
//   "options": "string"
// }
