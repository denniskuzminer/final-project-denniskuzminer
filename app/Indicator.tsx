"use client";

import {
  Accordion,
  AccordionSummary,
  Typography,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import "./globals.css";
import "./IndicatorsPicker.Module.css";
import { useDrag } from "react-dnd";
import { ITEM_TYPES } from "./constants";

const Indicator = (props) => {
  const { indicator } = props;
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ITEM_TYPES.INDICATOR,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

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
          <Typography>{indicator.calculation}</Typography>
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

export default Indicator;
