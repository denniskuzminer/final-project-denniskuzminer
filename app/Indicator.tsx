"use client";

import {
  Accordion,
  AccordionSummary,
  Typography,
  AccordionDetails,
  Divider,
  TextField,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import "./globals.css";
import "./IndicatorsPicker.Module.css";
import { useDrag } from "react-dnd";
import { ITEM_TYPES } from "./constants";
import { Fragment } from "react";
import { Box } from "@mui/system";
import { IndicatorProps } from "./models";

const Indicator = (props: IndicatorProps) => {
  const { indicator } = props;
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ITEM_TYPES.INDICATOR,
    id: indicator.name,
    item: indicator,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  // const handleIndicatorParamChange = (name, val) => {
  //   setIndicators((prev) =>
  //     prev.map((e) =>
  //       e.id === indicator.id ? { ...indicator, [name]: val } : e
  //     )
  //   );
  // };

  return (
    <div ref={drag}>
      <Accordion
        className="accordion"
        disableGutters
        square
        sx={{
          "&:before": {
            display: "none",
          },
        }}
        style={{
          opacity: isDragging ? 0.5 : 1,
        }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>{indicator.name}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>{indicator.description}</Typography>
        </AccordionDetails>
        <Divider />
        <Box sx={{ margin: "10%" }}>
          {Object.entries(indicator.params ?? {}).map(([k, e], i) => (
            <Fragment key={i}>
              <Typography>{k}</Typography>
              <TextField name={k} defaultValue={e} type="number" />
            </Fragment>
          ))}
        </Box>
      </Accordion>
    </div>
  );
};

export default Indicator;
