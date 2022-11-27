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
  Button,
  Tabs,
  Tab,
} from "@mui/material";
import Divider from "@mui/material/Divider";
import { ResponsiveLine } from "@nivo/line";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { rightDrawerWidth, leftDrawerWidth } from "./backtest/constants";
import IndicatorsPicker from "./IndicatorsPicker";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { data, SEARCH_TIMEOUT } from "./constants";
import {
  getCompanyInfo,
  getPrices,
  searchSymbol,
} from "./utils/marketApiUtils";
import SearchIcon from "@mui/icons-material/Search";
import { useCallback, useEffect, useRef, useState } from "react";
import { debounce } from "lodash";

const toolTipElement = (props: any) => {
  return <div>{props.point.data.y} °C</div>;
};

export default function Landing(props: any) {
  const [symbol, setSymbol] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [companyInfo, setCompanyInfo] = useState({});
  const [isFavorite, setFavorite] = useState(true);

  const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSearch(e.target.value);
  };

  const handleSearchSelect = (e) => {
    if (e.target.textContent) {
      setSymbol(e.target.textContent);
    }
  };

  const handleFavoriteClick = (_) => {
    setFavorite((prev) => !prev);
  };

  const debouncedSearch = useRef(
    debounce(async (criteria) => {
      setSearchResults(await searchSymbol(criteria));
    }, SEARCH_TIMEOUT)
  ).current;

  useEffect(() => {
    getCompanyInfo(symbol).then((data) => setCompanyInfo(data));
  }, [symbol]);

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
          noOptionsText="Search equities and ETFs in the U.S."
          onChange={handleSearchSelect}
          sx={{
            alignItems: "center",
            justifyContent: "center",
            width: "40%",
          }}
          getOptionLabel={(option) =>
            `${option["1. symbol"]} - ${option["2. name"]}`
          }
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
      {!symbol ? (
        <Box
          sx={{
            marginTop: "5%",
            textAlign: "center",
          }}
        >
          <Typography variant="h3">Stratus</Typography>
          <Typography>
            Stratus is an application that allows you to backtest some
            <br />
            strategies that you may have in mind on equities or ETFs with a few
            technical indicators.
            <br />
            Search for your favorite stock or make an account to get started!
          </Typography>
        </Box>
      ) : (
        <Box
          className="graph-container"
          sx={{
            width: "100%",
            height: "70vh",
            marginTop: "4%",
          }}
        >
          <Box
            sx={{
              justifyContent: "space-between",
              display: "flex",
            }}
          >
            <Box>
              <Typography variant="h5">{companyInfo["Name"]}</Typography>
              <Typography>{`${companyInfo["Exchange"]}: ${companyInfo["Symbol"]}`}</Typography>
            </Box>
            <Box>
              <Button
                onClick={handleFavoriteClick}
                startIcon={
                  isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />
                }
              >
                Favorite
              </Button>
            </Box>
          </Box>
          <Box
            sx={{
              justifyContent: "space-between",
              display: "flex",
              marginTop: "1%",
            }}
          >
            <Box>
              <Typography color="secondary">{`${companyInfo["PERatio"]}: ${companyInfo["Symbol"]} ↗↘`}</Typography>
            </Box>
            <Box>
              <Tabs centered value={"Line"}>
                <Tab sx={{ minWidth: "0" }} value="Line" label="Line" />
                <Tab sx={{ minWidth: "0" }} value="Candle" label="Candle" />
              </Tabs>
            </Box>
            <Box>
              <Tabs centered value={"1H"}>
                <Tab sx={{ minWidth: "0" }} value="1H" label="1H" />
                <Tab sx={{ minWidth: "0" }} value="4H" label="4H" />
                <Tab sx={{ minWidth: "0" }} value="1D" label="1D" />
                <Tab sx={{ minWidth: "0" }} value="1W" label="1W" />
                <Tab sx={{ minWidth: "0" }} value="1M" label="1M" />
                <Tab sx={{ minWidth: "0" }} value="YTD" label="YTD" />
                <Tab sx={{ minWidth: "0" }} value="1Y" label="1Y" />
                <Tab sx={{ minWidth: "0" }} value="5Y" label="5Y" />
              </Tabs>
            </Box>
          </Box>
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
      )}
    </Box>
  );
}
