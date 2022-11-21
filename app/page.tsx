"use client";

import CustomDrawer from "./CustomDrawer";
import {
  Accordion,
  AccordionSummary,
  Typography,
  AccordionDetails,
  Box,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { rightDrawerWidth, leftDrawerWidth } from "./backtest/constants";
import IndicatorsPicker from "./IndicatorsPicker";

export default function Landing(props: any) {
  return (
    <Box sx={{ paddingRight: rightDrawerWidth, paddingLeft: leftDrawerWidth }}>
      <IndicatorsPicker {...props} />
      <h1>Stratus</h1>
      This will eventually be something, to access form for Milestone 2 go to
      the Backtest tab
    </Box>
  );
}
