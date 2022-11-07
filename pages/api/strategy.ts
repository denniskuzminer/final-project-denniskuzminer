import dbConnect from "../../utils/dbConnect";
import Strategy from "../../models/strategy";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await dbConnect();
    // console.log(req.body);
    const newStrategy = new Strategy(
      typeof req.body === "string" ? JSON.parse(req.body) : req.body
    );
    const test = await newStrategy.save();
    res.status(200).json(test);
  } catch (error) {
    console.log(error);
    res.json({ error });
  }
}
