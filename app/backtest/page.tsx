"use client";

import {
  Accordion,
  AccordionSummary,
  Typography,
  AccordionDetails,
  Button,
  FormLabel,
  TextField,
  Drawer,
  Box,
  Skeleton,
} from "@mui/material";
import { Fragment, MouseEventHandler, useEffect, useState } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import dayjs, { Dayjs } from "dayjs";
import { Formik, FormikProps, Form, Field } from "formik";
import axios from "axios";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";

import BacktestForm from "./BacktestForm";
import {
  rightDrawerWidth,
  leftDrawerWidth,
  formFields,
  indicators,
} from "./constants";
import { BacktestFormData } from "./models";

import "./Backtest.Module.css";
import { LocalizationProvider } from "@mui/x-date-pickers";

export default function Backtest() {
  const [strategies, setStrategies] = useState([] as BacktestFormData[]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeStrategy, setActiveStrategy] = useState({} as BacktestFormData);
  const [value, setValue] = useState<Dayjs | null>(
    dayjs("2014-08-18T21:11:54")
  );

  const handleChange = (newValue: Dayjs | null) => {
    setValue(newValue);
  };

  const handleSaveStrategy = (values: BacktestFormData) => {
    let idx = -1;
    const exists = strategies.every((e, i) => {
      if (e.name === values.name) {
        idx = i;
      }
      return e.name === values.name;
    });
    if (exists) {
      axios
        .put("/api/strategy", values)
        .then((data) => console.log(data, "hello"))
        .catch((e) => console.log(e, "oh no"));
    } else {
      setStrategies((prev) => [...prev, { ...values, backtests: [] }]);
      axios
        .post("/api/strategy", values)
        .then((data) => console.log(data, "hello"))
        .catch((e) => console.log(e, "oh no"));
    }
  };

  const handleStartBacktest = (e: any, { values }: any) => {
    axios
      .post("/api/strategy", JSON.stringify(values))
      .then((data) => console.log(data, "hello"))
      .catch((e) => console.log(e, "oh no"));
  };

  const handleActiveStrategyChange = (
    e: any,
    newStrategy: any,
    formik: any
  ) => {
    setActiveStrategy(
      strategies.find((strategy) => strategy.name === newStrategy.name) as any
    );
    Object.keys(newStrategy).forEach((k) => {
      formik.setFieldValue(`${k}`, newStrategy[k]);
    });
  };

  useEffect(() => {
    console.log("hi");
    axios
      .get("/api/strategy")
      .then(({ data }) => {
        // console.log(data);
        setStrategies(data);
        setIsLoading(false);
      })
      .catch((e) => console.log(e, "oh no"));
  }, []);

  return (
    <Box sx={{ paddingRight: rightDrawerWidth, paddingLeft: leftDrawerWidth }}>
      {/* <Typography variant="h1">Backtest</Typography> */}
      <Formik
        initialValues={{} as BacktestFormData}
        onSubmit={handleSaveStrategy}
      >
        {(props: FormikProps<any>) => (
          <>
            <Drawer
              sx={{
                width: rightDrawerWidth,
                flexShrink: 0,
                "& .MuiDrawer-paper": {
                  width: rightDrawerWidth,
                  boxSizing: "border-box",
                },
              }}
              variant="permanent"
              anchor="right"
            >
              {isLoading ? (
                <div className="drawerInner">
                  {Array(5)
                    .fill(0)
                    .map((_, i) => (
                      <Skeleton
                        className="skeleton"
                        key={i}
                        height={60}
                        animation="wave"
                        variant="rounded"
                        // sx={{
                        //   "& .MuiSkeleton-wave::after": {
                        //     animationDelay: `${i * 50}ms !important`,
                        //   },
                        // }}
                      />
                    ))}
                </div>
              ) : (
                <div className="drawerInner">
                  {strategies.map((strategy, i) => (
                    <Accordion
                      onChange={(e, expanded) => {
                        if (expanded) {
                          handleActiveStrategyChange(e, strategy, props);
                        }
                      }}
                      className="accordion"
                      disableGutters
                      square
                      key={i}
                      sx={{
                        "&:before": {
                          display: "none",
                        },
                      }}
                    >
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography>{strategy.name}</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        {strategy.backtests.map((backtest: any, i: Number) => (
                          <div>
                            <Button>{backtest.name}</Button>
                          </div>
                        ))}
                      </AccordionDetails>
                    </Accordion>
                  ))}
                </div>
              )}
            </Drawer>
            <Drawer
              sx={{
                width: leftDrawerWidth,
                flexShrink: 0,
                "& .MuiDrawer-paper": {
                  width: leftDrawerWidth,
                  boxSizing: "border-box",
                },
              }}
              variant="permanent"
              anchor="left"
            >
              <div className="drawerInner">
                {indicators.map((indicator, i) => (
                  <Accordion
                    className="accordion"
                    disableGutters
                    square
                    key={i}
                    sx={{
                      "&:before": {
                        display: "none",
                      },
                    }}
                  >
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography>{indicator.name}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography>{indicator.description}</Typography>
                      <Typography>{indicator.calculation}</Typography>
                    </AccordionDetails>
                  </Accordion>
                ))}
              </div>
            </Drawer>

            <Form>
              {formFields.map(({ id, label, text }, i) => (
                <Field key={i} name={id}>
                  {({ field }: any) => (
                    <div>
                      <FormLabel htmlFor={id}>{text}:</FormLabel>
                      <br />
                      {{
                        _: (
                          // <LocalizationProvider dateAdapter={AdapterDayjs}>
                          //   <DateTimePicker
                          //     id={id}
                          //     label={label}
                          //     // value={value}
                          //     onChange={handleChange}
                          //     renderInput={(params) => (
                          //       <TextField {...params} />
                          //     )}
                          //   />
                          // </LocalizationProvider>
                          <></>
                        ),
                      }[label] || (
                        <TextField
                          id={id}
                          label={label}
                          InputLabelProps={
                            !!activeStrategy.name ? { shrink: true } : {}
                          }
                          variant="outlined"
                          {...field}
                        />
                      )}
                    </div>
                  )}
                </Field>
              ))}

              <Button onClick={(e) => handleStartBacktest(e, props)}>
                Start Backtest
              </Button>
              <Button type="submit">Save Backtest</Button>
            </Form>
          </>
        )}
      </Formik>
    </Box>
  );
}
// {
//   /* {Object.keys(strategy).map((field, i) =>
//                     field !== "_id" && field !== "__v" ? (
//                       <>
//                         <Typography>{field}:</Typography>
//                         <TextField value={strategy[field]}></TextField>
//                       </>
//                     ) : (
//                       <></>
//                     )
//                   )} */
// }
