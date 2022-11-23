"use client";

import CustomDrawer from "./CustomDrawer";
import {
  Accordion,
  AccordionSummary,
  Typography,
  AccordionDetails,
  Box,
  InputBase,
  IconButton,
  Input,
  TextField,
  Autocomplete,
} from "@mui/material";
import Divider from "@mui/material/Divider";
import { ResponsiveLine } from "@nivo/line";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { rightDrawerWidth, leftDrawerWidth } from "./backtest/constants";
import IndicatorsPicker from "./IndicatorsPicker";
import { data, SEARCH_TIMEOUT } from "./constants";
import { getPrices, searchSymbol } from "./utils/marketApiUtils";
import SearchIcon from "@mui/icons-material/Search";
import { useCallback, useEffect, useRef, useState } from "react";
import { debounce } from "lodash";

const toolTipElement = (props: any) => {
  return <div>{props.point.data.y} °C</div>;
};

export default function Landing(props: any) {
  const [symbol, setSymbol] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSearch(e.target.value);
  };

  const handleSearchSelect = (e) => {
    if (e.target.textContent) {
      setSymbol(e.target.value);
    }
  };

  const debouncedSearch = useRef(
    debounce(async (criteria) => {
      console.log("first");
      setSearchResults(await searchSymbol(criteria));
    }, SEARCH_TIMEOUT)
  ).current;

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  return (
    <Box sx={{ paddingRight: rightDrawerWidth, paddingLeft: leftDrawerWidth }}>
      <IndicatorsPicker {...props} />
      {/* {getPrices("IBM", "5min")} */}
      <CustomDrawer anchor="right">
        <div></div>
      </CustomDrawer>
      <Box
        sx={{
          marginTop: "2%",
          width: "100%",
          display: "flex",
          // border: "4px solid yellow",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Autocomplete
          options={searchResults}
          clearOnBlur={false}
          autoComplete={true}
          onChange={handleSearchSelect}
          sx={{
            alignItems: "center",
            justifyContent: "center",
            width: "40%",
          }}
          getOptionLabel={(option) =>
            `${option["1. symbol"]} - ${option["2. name"]}`
          }
          // sx={{ width: 300 }}
          renderInput={(params) => (
            <TextField
              {...params}
              sx={{
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
              }}
              onChange={handleSearchChange}
              placeholder="Search Stratus"
              variant="standard"
              InputProps={{
                ...params.InputProps,
                startAdornment: (
                  <IconButton
                    type="button"
                    sx={{ p: "10px" }}
                    aria-label="search"
                  >
                    <SearchIcon />
                  </IconButton>
                ),
              }}
            />
          )}
          renderOption={(props, option) => {
            return (
              <li {...props}>
                <Box
                  sx={{
                    justifyContent: "space-between",
                    borderBottom: "1px grey solid",
                    width: "100%",
                  }}
                >
                  <Box>
                    <Typography variant="h6">{option["1. symbol"]}</Typography>
                  </Box>
                  <Box>
                    <Typography>{option["2. name"]}</Typography>
                  </Box>
                </Box>
              </li>
            );
          }}
        />
      </Box>
      <h1>Stratus</h1>
      This will eventually be something, to access form for Milestone 2 go to
      the Backtest tab This will eventually be something, to access form for
      Milestone 2 go to the Backtest tab This will eventually be something, to
      access form for Milestone 2 go to the Backtest tab This will eventually be
      something, to access form for Milestone 2 go to the Backtest tab This will
      eventually be something, to access form for Milestone 2 go to the Backtest
      tab
      <Box
        className="graph-container"
        sx={{
          width: "100%",
          height: "70vh",
        }}
      >
        <ResponsiveLine
          data={data}
          margin={{ top: 50, right: 160, bottom: 50, left: 60 }}
          xScale={{ type: "linear" }}
          yScale={{ type: "linear", stacked: true, min: 0, max: 2500 }}
          yFormat=" >-.2f"
          curve="monotoneX"
          axisTop={null}
          axisRight={{
            tickValues: [0, 500, 1000, 1500, 2000, 2500],
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            format: ".2s",
            legend: "",
            legendOffset: 0,
          }}
          axisBottom={{
            tickValues: [0, 20, 40, 60, 80, 100, 120],
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            format: ".2f",
            legend: "price",
            legendOffset: 36,
            legendPosition: "middle",
          }}
          axisLeft={{
            tickValues: [0, 500, 1000, 1500, 2000, 2500],
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            format: ".2s",
            legend: "volume",
            legendOffset: -40,
            legendPosition: "middle",
          }}
          enableGridX={false}
          colors={{ scheme: "spectral" }}
          lineWidth={1}
          pointSize={4}
          pointColor={{ theme: "background" }}
          pointBorderWidth={1}
          pointBorderColor={{ from: "serieColor" }}
          pointLabelYOffset={-12}
          useMesh={true}
          tooltip={toolTipElement}
          gridXValues={[0, 20, 40, 60, 80, 100, 120]}
          gridYValues={[0, 500, 1000, 1500, 2000, 2500]}
          legends={[
            {
              anchor: "bottom-right",
              direction: "column",
              justify: false,
              translateX: 140,
              translateY: 0,
              itemsSpacing: 2,
              itemDirection: "left-to-right",
              itemWidth: 80,
              itemHeight: 12,
              itemOpacity: 0.75,
              symbolSize: 12,
              symbolShape: "circle",
              symbolBorderColor: "rgba(0, 0, 0, .5)",
              effects: [
                {
                  on: "hover",
                  style: {
                    itemBackground: "rgba(0, 0, 0, .03)",
                    itemOpacity: 1,
                  },
                },
              ],
            },
          ]}
        />
      </Box>
    </Box>
  );
}
