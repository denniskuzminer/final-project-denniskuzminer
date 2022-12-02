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
  LinearProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import FilterDramaIcon from "@mui/icons-material/FilterDrama";
import {
  rightDrawerWidth,
  leftDrawerWidth,
  defaultIndicators,
} from "./backtest/constants";
import IndicatorsPicker from "./IndicatorsPicker";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import {
  SEARCH_TIMEOUT,
  TIME_FRAMES,
  TIME_FRAMES_TO_INTERVALS,
} from "./constants";
import {
  API_LIMIT_ERROR_MESSAGE,
  formatDollarAmount,
  getCompanyInfoAndNews,
  getPrices,
  hitAPILimit,
  Prices,
  searchSymbol,
} from "./utils/marketApiUtils";
import SearchIcon from "@mui/icons-material/Search";
import { SyntheticEvent, useEffect, useRef, useState } from "react";
import { debounce } from "lodash";
import { convertAPIStringToDateString } from "./utils/dateUtils";
import { stockDown, stockUp } from "./utils/graphUtils";
import Divider from "@mui/material/Divider";
import Graph from "./Graph";
import Loader from "./Loader";
import axios from "axios";
import { IndicatorModel } from "./backtest/models";

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

const SignInMessage = ({ handleAskSignIn, askForSignInOpen }: any) => {
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
  const [symbol, setSymbol] = useState<string>("");
  const [searchResults, setSearchResults] = useState<any>([]);
  const [companyInfo, setCompanyInfo] = useState<any>({});
  const [companyNews, setCompanyNews] = useState<any>({});
  const [askForSignInOpen, setAskForSignInOpen] = useState<boolean>(false);
  const [timeFrame, setTimeFrame] = useState<string>("1D");
  const [interval, setInterval] = useState<string>("5min");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [companyTimeSeries, setCompanyTimeSeries] = useState<Prices>(
    {} as Prices
  );
  const [graphLoading, setGraphLoading] = useState<boolean>(false);
  const [favoritesLoading, setFavoritesLoading] = useState<boolean>(false);
  const [graphType, setGraphType] = useState<string>("Line");
  const [indicators, setIndicators] =
    useState<Array<IndicatorModel>>(defaultIndicators);
  const [needToPollAgain, setNeedToPollAgain] = useState<any>({
    companyTimeSeries: false,
    companyInfo: false,
    companyNews: false,
  });

  const isFavorite =
    user.favorites && user.favorites.includes(companyInfo?.Symbol);
  const stockStyles =
    companyTimeSeries.direction === "up" ? stockUp : stockDown;
  const finalPrice = +(companyTimeSeries.y?.at(0) ?? 1);
  const initialPrice = +(
    companyTimeSeries.y?.at(companyTimeSeries.y?.length - 1) ?? 1
  );
  const percentChange = Number(
    (((finalPrice - initialPrice) / initialPrice) * 100).toFixed(2)
  );

  const handleSearchSelect = (e: any) => {
    if (e.target.textContent) {
      setSymbol(e.target.textContent);
    }
  };

  const handleAskSignIn = () => {
    setAskForSignInOpen((prev) => !prev);
  };

  const handleAddFavorite = async () => {
    if (Object.keys(user).length === 0) {
      handleAskSignIn();
      return;
    }
    setFavoritesLoading(true);
    const newFavorites = !isFavorite
      ? [...user.favorites, companyInfo["Symbol"]]
      : user.favorites.filter((e: string) => e !== companyInfo["Symbol"]);
    axios
      .put("/api/user/addFavorite", {
        username: user.username,
        favorites: newFavorites,
      })
      .then(({ data }) => {
        const { username, hash, favorites, strategies, backtests } = data;
        setUser({ username, hash, favorites, strategies, backtests });
        setFavoritesLoading(false);
      })
      .catch((err) => {
        setFavoritesLoading(false);
      });
  };

  const handleTimeFrameChange = (e: any) => {
    const newVal = e.target.textContent ?? "";
    setTimeFrame(newVal);
    if (!TIME_FRAMES_TO_INTERVALS[newVal].includes(interval)) {
      setInterval(TIME_FRAMES_TO_INTERVALS[newVal][0]);
    }
  };

  const handleGraphTypeChange = (_: any, newValue: string) => {
    setGraphType(newValue);
  };

  const handleIntervalChange = (e: any) => {
    setInterval(e.target.textContent ?? "");
  };

  const debouncedSearch = useRef(
    debounce(async (criteria) => {
      setSearchResults(await searchSymbol(criteria));
    }, SEARCH_TIMEOUT)
  ).current;

  const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSearch(e.target.value);
  };

  useEffect(() => {
    setIsLoading(true);
    setGraphLoading(true);
    getCompanyInfoAndNews(symbol).then((data: any) => {
      const { info, news } = data;
      if (!hitAPILimit(info)) {
        setCompanyInfo(info || {});
        setNeedToPollAgain((prev: any) => ({ ...prev, companyInfo: false }));
        setIsLoading(false);
      } else {
        setNeedToPollAgain((prev: any) => ({ ...prev, companyInfo: true }));
      }
      if (!hitAPILimit(news)) {
        setCompanyNews(news || {});
        setNeedToPollAgain((prev: any) => ({ ...prev, companyNews: false }));
        setIsLoading(false);
      } else {
        setNeedToPollAgain((prev: any) => ({ ...prev, companyNews: true }));
      }
    });
  }, [symbol]);

  useEffect(() => {
    getPrices(symbol, timeFrame, interval).then((data: any) => {
      console.log("Get prices was called", data);
      if (!hitAPILimit(data)) {
        setCompanyTimeSeries(data || {});
        setGraphLoading(false);
        setNeedToPollAgain((prev: any) => ({
          ...prev,
          companyTimeSeries: false,
        }));
      } else {
        setNeedToPollAgain((prev: any) => ({
          ...prev,
          companyTimeSeries: true,
        }));
      }
    });
  }, [companyInfo]); //also create useEffect for timeframe and interval that gets prices from cache

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  return (
    <Box sx={{ paddingRight: rightDrawerWidth, paddingLeft: leftDrawerWidth }}>
      <IndicatorsPicker
        {...props}
        indicators={indicators}
        setIndicators={setIndicators}
        setSymbol={setSymbol}
      />
      <CustomDrawer anchor="right">
        {symbol ? (
          <Box
            sx={{
              height: "100%",
              padding: "10%",
              overflow: "hidden",
            }}
          >
            <Typography fontWeight="700" variant="h6">
              About:
            </Typography>
            <Box
              sx={{
                height: "47%",
                overflow: "auto",
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
                  {companyNews?.feed?.map(
                    (
                      {
                        title,
                        url,
                        banner_image,
                        time_published,
                        source_domain,
                      }: any,
                      i: number
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
          noOptionsText="Search equities in the U.S."
          onChange={handleSearchSelect}
          sx={{
            alignItems: "center",
            justifyContent: "center",
            width: "40%",
          }}
          getOptionLabel={(option: any) =>
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
          <Box
            sx={{
              display: "inline",
            }}
          >
            <Typography
              sx={{
                display: "inline-block",
                verticalAlign: "middle",
              }}
              variant="h3"
            >
              Stratus
            </Typography>
            <FilterDramaIcon
              fontSize="large"
              sx={{
                display: "inline-block",
                verticalAlign: "middle",
                marginLeft: "2%",
              }}
            />
          </Box>
          <Typography>
            Stratus is an application that allows you to backtest some
            <br />
            strategies that you may have in mind on equities with a few
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
            <Loader />
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
                    onClick={handleAddFavorite}
                    startIcon={
                      favoritesLoading ? (
                        <></>
                      ) : isFavorite ? (
                        <FavoriteIcon />
                      ) : (
                        <FavoriteBorderIcon />
                      )
                    }
                  >
                    {favoritesLoading ? (
                      <LinearProgress sx={{ width: "100%" }} />
                    ) : (
                      <>Favorite</>
                    )}
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
                  <Typography color={stockStyles.main}>{`${formatDollarAmount(
                    finalPrice
                  )}`}</Typography>
                  <Typography color={stockStyles.main}>{`${percentChange}% ${
                    companyTimeSeries.direction === "up" ? "↗" : "↘"
                  }`}</Typography>
                </Box>
                <Box>
                  <Tabs
                    centered
                    value={graphType}
                    onChange={handleGraphTypeChange}
                  >
                    <Tab sx={{ minWidth: "0" }} value="Line" label="Line" />
                    <Tab sx={{ minWidth: "0" }} value="Candle" label="Candle" />
                  </Tabs>
                </Box>
                <Box className="align-right">
                  <Tabs
                    onChange={handleTimeFrameChange}
                    value={timeFrame}
                    className="align-right"
                  >
                    {TIME_FRAMES.map((e, i) => (
                      <Tab sx={{ minWidth: "0" }} key={i} value={e} label={e} />
                    ))}
                  </Tabs>
                  <Box className="align-right">
                    <Tabs
                      value={interval}
                      onChange={handleIntervalChange}
                      className="align-right"
                    >
                      {TIME_FRAMES_TO_INTERVALS[timeFrame].map((e, i) => (
                        <Tab
                          sx={{ minWidth: "0" }}
                          key={i}
                          value={e}
                          label={e}
                        />
                      ))}
                    </Tabs>
                  </Box>
                </Box>
              </Box>
              <Graph
                stockStyles={stockStyles}
                companyInfo={companyInfo}
                companyTimeSeries={companyTimeSeries}
                graphLoading={graphLoading}
                graphType={graphType}
                indicators={indicators}
                setIndicators={setIndicators}
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
              <Divider />
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
              <Divider />
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
