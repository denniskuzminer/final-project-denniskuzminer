import dbConnect from "../../utils/dbConnect";
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
      const allStrats = [
        {
          _id: "testid",
          name: "This is a test",
          principal: 1000,
          condition: "This is the condition string",
          actionIf: "BUY",
          actionElse: "SELL",
          on: "TSLA",
          per: "1D",
          startDate: "10/10/2021",
          endDate: "10/10/2022",
          options: "",
          backtests: [{ name: "Backtest 1 id" }, { name: "Backtest 2 id" }],
          __v: "0",
        },
      ]; // await Strategy.find({});
      // console.log(allStrats);
      res.status(200).json(allStrats);

      // console.log("\n\n\n\n\n\n\n\n\n\nHIIIIIIIIIIIII");
    }
  } catch (error) {
    console.log(error);
    res.json({ error });
  }
}
