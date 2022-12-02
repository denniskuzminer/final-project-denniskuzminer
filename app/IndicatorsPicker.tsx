"use client";

import {
  Typography,
  Avatar,
  Button,
  Stack,
  Card,
  CardContent,
  Popover,
  TextField,
  Alert,
  CircularProgress,
  IconButton,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import CloseIcon from "@mui/icons-material/Close";
import "./globals.css";
import "./IndicatorsPicker.Module.css";
import CustomDrawer from "./CustomDrawer";
import { Box } from "@mui/system";
import { useState, useEffect } from "react";
import { stringAvatar } from "./utils/profileUtils";
import axios from "axios";
import {
  formatDollarAmount,
  getDataFromFavorites,
} from "./utils/marketApiUtils";
import Indicator from "./Indicator";
import { IndicatorModel } from "./backtest/models";

interface ProfileProps {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
  setSymbol: React.Dispatch<React.SetStateAction<string>>;
}

interface User {
  username: string;
  hash: string;
  favorites: Array<string>;
  strategies: Array<Object>;
  backtests: Array<Object>;
}

interface LoginFormData {
  username: string;
  password: string;
}

interface SignUpFormData {
  username: string;
  password: string;
  confirmPassword: string;
}

type LoginFormDataLike = LoginFormData | SignUpFormData;

// type IndicatorsPickerProps = ProfileProps;

interface IndicatorsPickerProps extends ProfileProps {
  indicators: IndicatorModel[];
  setIndicators: React.Dispatch<React.SetStateAction<IndicatorModel[]>>;
}

export default function IndicatorsPicker(props: IndicatorsPickerProps) {
  const { user, setSymbol, indicators, setIndicators } = props;
  const { favorites } = user;
  const [favoritesData, setFavoritesData] = useState([]);

  const handleFavoriteClick = (_: any, symbol: string) => {
    setSymbol(symbol);
  };

  useEffect(() => {
    getDataFromFavorites(favorites).then((values: Array<Object>) => {
      setFavoritesData(values.map((e: any) => e.data) as any);
    });
  }, [favorites]);

  return (
    <CustomDrawer anchor="left">
      <Profile {...props} />
      <Box
        sx={{
          padding: "4%",
          height: "100vh",
          overflow: "hidden",
        }}
      >
        <Typography>Indicators:</Typography>
        <Box
          sx={{
            height: "50%",
            overflow: "auto",
          }}
          className="custom-scroll"
        >
          {indicators.map((indicator, i) => (
            <div key={i}>
              <Indicator indicator={indicator} setIndicators={setIndicators} />
            </div>
          ))}
        </Box>
        <br />
        <Typography>Favorites:</Typography>
        {favorites ? (
          <Box
            sx={{
              height: "43%",
              // border: "5px solid yellow",
              overflow: "auto",
            }}
            className="custom-scroll"
          >
            {favoritesData.length ? (
              <>
                {favoritesData?.map((e, i) => (
                  <Card
                    key={i}
                    sx={{
                      marginBottom: "5%",
                      cursor: "pointer",
                    }}
                    className="card-hover"
                    onClick={(ev) =>
                      handleFavoriteClick(ev, e["Global Quote"]["01. symbol"])
                    }
                  >
                    <CardContent>
                      <Typography>{e["Global Quote"]["01. symbol"]}</Typography>
                      <Typography
                        color={
                          +e["Global Quote"]["09. change"] < 0 ? "red" : "green"
                        }
                        fontSize="15px"
                      >
                        {formatDollarAmount(e["Global Quote"]["05. price"])} /{" "}
                        {e["Global Quote"]["10. change percent"]}{" "}
                        {+e["Global Quote"]["09. change"] < 0 ? "↘" : "↗"}
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
              </>
            ) : (
              <Box
                sx={{
                  height: "40%",
                  display: "flex",
                }}
              >
                <Typography
                  sx={{
                    textAlign: "center",
                    margin: "auto",
                  }}
                >
                  Search and click the favorite button to see your favorite
                  stock tickers pinned
                </Typography>
              </Box>
            )}
          </Box>
        ) : (
          <Box
            sx={{
              display: "flex",
              margin: "3%",
              height: "40%",
            }}
          >
            <Typography
              sx={{
                textAlign: "center",
                margin: "auto",
              }}
            >
              Login to save and see favorites
            </Typography>
          </Box>
        )}
      </Box>
    </CustomDrawer>
  );
}

function Profile(props: ProfileProps) {
  const { user, setUser } = props;
  const { username } = user;
  const [formLoading, setFormLoading] = useState(false);
  const [formOpen, setFormOpen] = useState("");
  const [formData, setFormData] = useState<LoginFormDataLike>(
    {} as LoginFormDataLike
  );
  const [error, setError] = useState("");

  const handleLoginFormOpen = () => {
    setFormOpen("Login");
  };

  const handleSignUpFormOpen = () => {
    setFormOpen("Sign up");
  };

  const handleLogoutFormOpen = () => {
    setFormOpen("Logout");
  };

  const handleClose = () => {
    setError("");
    setFormOpen("");
  };

  const handleEscapePress = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setFormOpen("");
    }
  };

  const handleLogout = () => {
    setUser({} as User);
    handleClose();
  };

  const handleStopProp = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
  };

  const handleLogin = () => {
    setFormLoading(true);
    axios
      .post("/api/user/login", {
        username: formData.username,
        password: formData.password,
      })
      .then(({ data }) => {
        const { username, hash, favorites, strategies, backtests } = data;
        setUser({ username, hash, favorites, strategies, backtests });
        setFormLoading(false);
        setError("");
        handleClose();
      })
      .catch((err) => {
        setFormLoading(false);
        setError(err.response.data);
      });
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevState: LoginFormDataLike) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSignup = () => {
    setFormLoading(true);
    axios
      .post("/api/user/signup", formData)
      .then(({ data }) => {
        const { username, hash, favorites, strategies, backtests } = data;
        setUser({ username, hash, favorites, strategies, backtests });
        setFormLoading(false);
        setError("");
        handleClose();
      })
      .catch((err) => {
        setFormLoading(false);
        setError(err.response.data);
      });
  };

  return (
    <Box>
      <div className="profile-root">
        {!!username ? (
          <Card className="profile" onClick={handleLogoutFormOpen}>
            <Stack className="profile-container" direction="row" spacing={2}>
              <Avatar
                className="profile-avatar"
                variant="rounded"
                {...stringAvatar(user.username)}
              />
              <div className="username-container">
                <Typography variant="h6" className="username">
                  {user.username}
                </Typography>
              </div>
            </Stack>
          </Card>
        ) : (
          <Stack className="login-buttons" direction="row" spacing={2}>
            <Button
              onClick={handleLoginFormOpen}
              className="login-button"
              variant="contained"
            >
              LOGIN
            </Button>
            <Button onClick={handleSignUpFormOpen} variant="contained">
              SIGN UP
            </Button>
          </Stack>
        )}
        <Popover
          className="popover"
          open={!!formOpen}
          anchorOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
          onKeyDown={handleEscapePress}
        >
          {{
            Logout: (
              <Card onClick={handleStopProp} className="logout-popover">
                <IconButton
                  sx={{ position: "absolute", top: "1%", right: "1%" }}
                  onClick={handleClose}
                >
                  <CloseIcon />
                </IconButton>
                <Button variant="contained" onClick={handleLogout}>
                  Logout
                </Button>
              </Card>
            ),
            Login: (
              <Card onClick={handleStopProp} className="login-popover">
                <IconButton
                  sx={{ position: "absolute", top: "1%", right: "1%" }}
                  onClick={handleClose}
                >
                  <CloseIcon />
                </IconButton>
                <Typography className="login-heading" variant="h5">
                  Login
                </Typography>
                <TextField
                  className="login-text"
                  name="username"
                  label="Username"
                  onChange={handleFormChange}
                />
                <br />
                <TextField
                  className="login-text"
                  label="Password"
                  name="password"
                  type="password"
                  onChange={handleFormChange}
                />
                <br />
                <Button
                  startIcon={
                    formLoading ? (
                      <CircularProgress color="secondary" />
                    ) : (
                      <LockOutlinedIcon />
                    )
                  }
                  className="login-form-button"
                  variant="contained"
                  onClick={handleLogin}
                >
                  Login
                </Button>
                {!!error ? (
                  <>
                    <br />
                    <Alert severity="error">{error}</Alert>
                  </>
                ) : (
                  <></>
                )}
              </Card>
            ),
            "Sign up": (
              <Card onClick={handleStopProp} className="login-popover">
                <IconButton
                  onClick={handleClose}
                  sx={{ position: "absolute", top: "1%", right: "1%" }}
                >
                  <CloseIcon />
                </IconButton>
                <Typography className="login-heading" variant="h5">
                  Sign up
                </Typography>
                <TextField
                  name="username"
                  className="login-text"
                  label="Username"
                  onChange={handleFormChange}
                />
                <br />
                <TextField
                  className="login-text"
                  label="Password"
                  type="password"
                  name="password"
                  onChange={handleFormChange}
                />
                <br />
                <TextField
                  className="login-text"
                  label="Confirm Password"
                  name="confirmPassword"
                  type="password"
                  onChange={handleFormChange}
                />
                <br />
                <Button
                  startIcon={
                    formLoading ? (
                      <CircularProgress color="secondary" />
                    ) : (
                      <LockOutlinedIcon />
                    )
                  }
                  className="login-form-button"
                  variant="contained"
                  onClick={handleSignup}
                >
                  Sign up
                </Button>
                {!!error ? (
                  <>
                    <br />
                    <Alert severity="error">{error}</Alert>
                  </>
                ) : (
                  <></>
                )}
              </Card>
            ),
          }[formOpen] || <></>}
        </Popover>
      </div>

      <hr />
    </Box>
  );
}
