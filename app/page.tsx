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
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { rightDrawerWidth, leftDrawerWidth } from "./backtest/constants";
import IndicatorsPicker from "./IndicatorsPicker";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import {
  data,
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

const toolTipElement = (props: any) => {
  return <div>{props.point.data.y} °C</div>;
};

const ErrorMessage = () => {
  const message = API_LIMIT_ERROR_MESSAGE.split(". ");
  const [heading, ...rest] = message;

  return (
    <Box>
      <Typography variant="h5">{heading}</Typography>
      <Typography>{rest.join(". ")}</Typography>
    </Box>
  );
};

const SignInMessage = ({ handleAskSignIn, askForSignInOpen }) => {
  return (
    <Dialog open={askForSignInOpen} onClose={handleAskSignIn}>
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between" }}>
        <div>Sign In</div>
        <IconButton onClick={handleAskSignIn}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <DialogContentText>
          Please sign in or create an account to use this feature
        </DialogContentText>
      </DialogContent>
    </Dialog>
  );
};

export default function Landing(props: any) {
  const { user, setUser } = props;
  const [symbol, setSymbol] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [companyInfo, setCompanyInfo] = useState({});
  const [askForSignInOpen, setAskForSignInOpen] = useState(false);
  const [timeFrame, setTimeFrame] = useState("1D");
  const [interval, setInterval] = useState("5min");
  const [isLoading, setIsLoading] = useState(false);
  const [companyTimeSeries, setCompanyTimeSeries] = useState([]);

  const isFavorite =
    user.favorites && user.favorites.includes(companyInfo["Symbol"]);
  const stockStyles =
    companyTimeSeries.direction === "up" ? stockUp : stockDown;

  const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSearch(e.target.value);
  };

  const handleSearchSelect = (e) => {
    if (e.target.textContent) {
      setSymbol(e.target.textContent);
    }
  };

  const handleAskSignIn = (_) => {
    setAskForSignInOpen((prev) => !prev);
  };

  const handleTimeFrameChange = (e) => {
    const newVal = e.target.textContent;
    setTimeFrame(newVal);
    if (!TIME_FRAMES_TO_INTERVALS[newVal].includes(interval)) {
      setInterval(TIME_FRAMES_TO_INTERVALS[newVal][0]);
    }
  };

  const handleIntervalChange = (e) => {
    setInterval(e.target.textContent);
  };

  const debouncedSearch = useRef(
    debounce(async (criteria) => {
      setSearchResults(await searchSymbol(criteria));
    }, SEARCH_TIMEOUT)
  ).current;

  useEffect(() => {
    setIsLoading(true);
    getCompanyInfo(symbol).then((data) => {
      console.log(data);
      setCompanyInfo(data);
      setIsLoading(false);
    });
  }, [symbol]);

  useEffect(() => {
    getPrices(symbol, timeFrame, interval).then((data) => {
      console.log(data);
      setCompanyTimeSeries(data);
    });
  }, [companyInfo]); //also create useEffect for timeframe and interval that gets prices from cache

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  return (
    <Box sx={{ paddingRight: rightDrawerWidth, paddingLeft: leftDrawerWidth }}>
      <IndicatorsPicker {...props} setSymbol={setSymbol} />
      {/* {getPrices("IBM", "5min")} */}
      <CustomDrawer anchor="right">
        {symbol ? (
          <Box
            sx={{
              height: "100%",
              padding: "10%",
              overflow: "hidden",
              // border: "4px solid yellow",
            }}
          >
            <Typography fontWeight="700" variant="h6">
              About:
            </Typography>
            <Box
              sx={{
                height: "47%",
                overflow: "auto",
                // border: "4px solid yellow",
              }}
              className="custom-scroll"
            >
              {hitAPILimit(companyInfo) ? (
                <ErrorMessage />
              ) : (
                <Typography>{companyInfo["Description"]}</Typography>
              )}
            </Box>
            <br />
            <Typography fontWeight="700" variant="h6">
              News:
            </Typography>
            <Box
              className="custom-scroll"
              sx={{
                height: "47%",
                overflow: "auto",
                // border: "4px solid yellow",
              }}
            >
              {hitAPILimit(companyInfo) ? (
                <ErrorMessage />
              ) : (
                <Box>
                  {companyInfo["News"]?.feed?.map(
                    (
                      {
                        title,
                        url,
                        banner_image,
                        time_published,
                        source_domain,
                      },
                      i
                    ) => (
                      <Card
                        sx={{
                          cursor: "pointer",
                          marginBottom: "5%",
                        }}
                        onClick={() => window.open(url, "_blank")}
                        key={i}
                        className="card-hover"
                      >
                        <CardMedia
                          sx={{ maxHeight: "10%" }}
                          component="img"
                          image={banner_image}
                        />
                        <CardContent>
                          <Typography>{title}</Typography>
                          <Typography fontSize="10px">
                            {convertAPIStringToDateString(time_published)}
                          </Typography>
                          <Typography fontSize="12px">
                            {source_domain}
                          </Typography>
                        </CardContent>
                      </Card>
                    )
                  )}
                </Box>
              )}
            </Box>
          </Box>
        ) : (
          <Box
            sx={{
              height: "100%",
              display: "flex",
              margin: "3%",
            }}
          >
            <Typography
              sx={{
                textAlign: "center",
                margin: "auto",
              }}
            >
              Type in a stock ticker to get information and recent news
            </Typography>
          </Box>
        )}
      </CustomDrawer>
      <SignInMessage
        handleAskSignIn={handleAskSignIn}
        askForSignInOpen={askForSignInOpen}
      />
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
          <br /> <br />
          <Typography variant="h5">But be mindful...</Typography>
          <Typography>
            I am using a free tier of the AlphaVantage API. So please,
            <br />
            make <b>5 or fewer API requests PER MINUTE</b> to ensure you have
            the best experience.
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
          {isLoading ? (
            <Box
              sx={{
                display: "flex",
                width: "100%",
                justifyContent: "center",
                paddingTop: "10%",
              }}
            >
              <CircularProgress
                size="large"
                sx={{
                  width: "20%",
                  height: "30%",
                }}
              />
            </Box>
          ) : (
            <>
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
                    onClick={handleAskSignIn}
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
                  <Tabs
                    centered
                    value={interval}
                    onChange={handleIntervalChange}
                  >
                    {TIME_FRAMES_TO_INTERVALS[timeFrame].map((e, i) => (
                      <Tab sx={{ minWidth: "0" }} key={i} value={e} label={e} />
                    ))}
                  </Tabs>
                </Box>
                <Box>
                  <Tabs
                    onChange={handleTimeFrameChange}
                    centered
                    value={timeFrame}
                  >
                    {TIME_FRAMES.map((e, i) => (
                      <Tab sx={{ minWidth: "0" }} key={i} value={e} label={e} />
                    ))}
                  </Tabs>
                </Box>
              </Box>
              {/* <Plot
                data={[
                  {
                    x: companyTimeSeries.x,
                    y: companyTimeSeries.y,
                    type: "scatter",
                    mode: "lines",
                    marker: { color: "yellow" },
                    connectgaps: true,
                  },
                ]}
                layout={{ width: 720, height: 440 }}
                options={{ displaylogo: "false" }}
              /> */}
              {console.log(
                companyTimeSeries.y?.map((e, i) => [
                  new Date(companyTimeSeries.x[i]).getTime(),
                  +e,
                ])
              )}
              <HighchartsReact
                highcharts={Highcharts}
                constructorType={"stockChart"}
                options={{
                  rangeSelector: {
                    buttons: [],
                    inputEnabled: false,
                  },
                  plotOptions: {
                    series: {
                      lineColor: stockStyles.main,
                    },
                  },
                  series: [
                    {
                      name: companyInfo["Symbol"],
                      type: "area",
                      // xAxis: {
                      //   gapGridLineWidth: 0,
                      // },
                      data: companyTimeSeries.data,
                      gapSize: 5,
                      tooltip: {
                        valueDecimals: 2,
                      },
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
              <Box>
                <Typography className="info-header" variant="h5">
                  Info
                </Typography>
                <Box className="info-text-container">
                  <Box className="info-text-inner">
                    <Typography className="info-text">
                      Address: {companyInfo["Address"]}
                    </Typography>
                    <Typography className="info-text">
                      Sector: {companyInfo["Sector"]}
                    </Typography>
                    <Typography className="info-text">
                      Industry: {companyInfo["Industry"]}
                    </Typography>
                  </Box>
                  <Box className="info-text-inner">
                    <Typography className="info-text">
                      Market Capitalization:{" "}
                      {formatDollarAmount(+companyInfo["MarketCapitalization"])}
                    </Typography>
                    <Typography className="info-text">
                      Dividend Yield: {companyInfo["DividendYield"]}%
                    </Typography>
                    <Typography className="info-text">
                      Beta: {companyInfo["Beta"]}
                    </Typography>
                  </Box>
                </Box>
              </Box>
              <Box>
                <Typography className="info-header" variant="h5">
                  Price
                </Typography>
                <Box className="info-text-container">
                  <Box className="info-text-inner">
                    <Typography className="info-text">
                      52 Week High:{" "}
                      {formatDollarAmount(+companyInfo["52WeekHigh"])}
                    </Typography>
                  </Box>
                  <Box className="info-text-inner">
                    <Typography className="info-text">
                      52 Week Low:{" "}
                      {formatDollarAmount(+companyInfo["52WeekLow"])}
                    </Typography>
                  </Box>
                </Box>
                <Box
                  className="info-text-container"
                  sx={{ justifyContent: "center", padding: "2% 0 2% 0" }}
                >
                  <Typography variant="h5">
                    Analyst Target Price:{" "}
                    {formatDollarAmount(+companyInfo["AnalystTargetPrice"])}
                  </Typography>
                </Box>
              </Box>
              <Box>
                <Typography className="info-header" variant="h5">
                  Fundamentals
                </Typography>
                <Box className="info-text-container">
                  <Box className="info-text-inner">
                    <Typography className="info-text">
                      EBITDA: {formatDollarAmount(+companyInfo["EBITDA"])}
                    </Typography>
                    <Typography className="info-text">
                      EPS: {companyInfo["EPS"]}
                    </Typography>
                    <Typography className="info-text">
                      EV To EBITDA: {companyInfo["EVToEBITDA"]}
                    </Typography>
                    <Typography className="info-text">
                      EV To Revenue: {companyInfo["EVToRevenue"]}
                    </Typography>
                    <Typography className="info-text">
                      Price To Book Ratio: {companyInfo["PriceToBookRatio"]}
                    </Typography>
                  </Box>
                  <Box className="info-text-inner" sx={{ marginBottom: "5%" }}>
                    <Typography className="info-text">
                      Gross Profit TTM:{" "}
                      {formatDollarAmount(+companyInfo["GrossProfitTTM"])}
                    </Typography>
                    <Typography className="info-text">
                      Profit Margin: {companyInfo["ProfitMargin"]}
                    </Typography>
                    <Typography className="info-text">
                      PE Ratio: {companyInfo["PERatio"]}
                    </Typography>
                    <Typography className="info-text">
                      Trailing PE: {companyInfo["TrailingPE"]}
                    </Typography>
                    <Typography className="info-text">
                      Forward PE: {companyInfo["ForwardPE"]}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </>
          )}
        </Box>
      )}
    </Box>
  );
}
