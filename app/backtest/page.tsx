"use client";

import { Button, FormLabel, TextField } from "@mui/material";
import { MouseEventHandler } from "react";
import { Formik, FormikProps, Form, Field } from "formik";
import axios from "axios";

type Action = "BUY" | "SELL" | "NOTHING" | undefined;

interface BacktestFormData {
  name: string;
  principal: Number;
  condition: string;
  actionIf?: Action;
  actionElse?: Action;
  on: string;
  per: string;
  startDate: Date;
  endDate: Date;
  options?: string;
}

const formFields = [
  { id: "name", label: "Name", text: "Name" },
  { id: "principal", label: "Amount", text: "Principal" },
  { id: "condition", label: "Condition", text: "If" },
  { id: "actionIf", label: "Action", text: "Do" },
  { id: "actionElse", label: "Action", text: "Else do" },
  { id: "on", label: "Ticker", text: "Backtest On" },
  { id: "per", label: "Interval", text: "Per" },
  { id: "from", label: "Date", text: "Start Date" },
  { id: "to", label: "Date", text: "End Date" },
  { id: "options", label: "Options", text: "Options" },
];

export default function Backtest() {
  const handleSaveBacktest = async (values: BacktestFormData) => {
    axios
      .post("/api/strategy", values)
      .then((data) => console.log(data, "hello"))
      .catch((e) => console.log(e, "oh no"));
  };

  const handleStartBacktest = (e, { values }) => {
    axios
      .post("/api/strategy", JSON.stringify(values))
      .then((data) => console.log(data, "hello"))
      .catch((e) => console.log(e, "oh no"));
  };

  return (
    <div>
      <h1>Backtest</h1>
      <Formik
        initialValues={{} as BacktestFormData}
        onSubmit={handleSaveBacktest}
      >
        {(props: FormikProps<any>) => (
          <Form>
            {formFields.map(({ id, label, text }, i) => (
              <Field key={i} name={id}>
                {({ field }) => (
                  <>
                    <FormLabel htmlFor={id}>{text}:</FormLabel>
                    <TextField
                      id={id}
                      label={label}
                      variant="outlined"
                      {...field}
                    />
                  </>
                )}
              </Field>
            ))}

            <Button onClick={(e) => handleStartBacktest(e, props)}>
              Start Backtest
            </Button>
            <Button type="submit">Save Backtest</Button>
          </Form>
        )}
      </Formik>
    </div>
  );
}
