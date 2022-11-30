"use client";

import CustomDrawer from "./CustomDrawer";
import {
  Typography,
  Box,
  IconButton,
  TextField,
  Autocomplete,
  Button,
  Tabs,
  Tab,
  Card,
  CardMedia,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  CircularProgress,
  LinearProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import FilterDramaIcon from "@mui/icons-material/FilterDrama";
import { rightDrawerWidth, leftDrawerWidth } from "./backtest/constants";
import IndicatorsPicker from "./IndicatorsPicker";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import {
  data,
  ITEM_TYPES,
  SEARCH_TIMEOUT,
  TIME_FRAMES,
  TIME_FRAMES_TO_INTERVALS,
} from "./constants";
import {
  API_LIMIT_ERROR_MESSAGE,
  formatDollarAmount,
  getCompanyInfo,
  getPrices,
  hitAPILimit,
  searchSymbol,
} from "./utils/marketApiUtils";
import SearchIcon from "@mui/icons-material/Search";
import { useEffect, useRef, useState } from "react";
import { debounce } from "lodash";
import { convertAPIStringToDateString } from "./utils/dateUtils";
import Plot from "react-plotly.js";
import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";
import { easeOutBounce, stockDown, stockUp } from "./utils/graphUtils";
import { theme } from "./theme/themes";
import Divider from "@mui/material/Divider";
import { useDrop } from "react-dnd";
import Loader from "./Loader";

const Graph = (props) => {
  const {
    stockStyles,
    companyInfo,
    companyTimeSeries,
    graphLoading,
    setGraphLoading,
  } = props;
  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: ITEM_TYPES.INDICATOR,
      drop: () => console.log("hello"),
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
      }),
    }),
    []
  );

  return (
    <div
      ref={drop}
      style={{
        opacity: isOver ? 0.5 : 1,
      }}
    >
      {graphLoading ? (
        <div style={{ position: "absolute", zIndex: 20000000, width: "65%" }}>
          <Loader />
        </div>
      ) : (
        <></>
      )}
      <div
        style={{
          opacity: graphLoading ? 0.5 : 1,
        }}
      >
        <HighchartsReact
          highcharts={Highcharts}
          constructorType={"stockChart"}
          options={{
            rangeSelector: {
              enabled: false,
            },
            scrollbar: {
              enabled: false,
            },
            navigator: {
              enabled: false,
            },
            plotOptions: {
              series: {
                lineColor: stockStyles.main,
              },
            },
            tooltip: {
              shared: true,
              useHTML: true,
              xDateFormat: "%H:%M %Y-%m-%d",
              backgroundColor: theme.palette.background.default,
              style: { color: theme.palette.secondary.main },
            },
            series: [
              {
                name: companyInfo["Symbol"],
                type: "area",
                data: companyTimeSeries.data,
                gapSize: 5,
                fillColor: {
                  linearGradient: {
                    x1: 0,
                    y1: 0,
                    x2: 0,
                    y2: 1,
                  },
                  stops: [
                    [0, stockStyles.main],
                    [1, stockStyles.transparent],
                  ],
                },
                threshold: null,
                animation: {
                  duration: 3000,
                  easing: easeOutBounce,
                },
              },
            ],
          }}
        />
      </div>
    </div>
  );
};

export default Graph;
