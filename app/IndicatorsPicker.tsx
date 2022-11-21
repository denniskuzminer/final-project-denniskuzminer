"use client";

import {
  Accordion,
  AccordionSummary,
  Typography,
  AccordionDetails,
  Avatar,
  Button,
  Stack,
  Card,
  Popover,
  ClickAwayListener,
  TextField,
  Alert,
  CircularProgress,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { indicators } from "./backtest/constants";

import "./globals.css";
import "./IndicatorsPicker.Module.css";
import CustomDrawer from "./CustomDrawer";
import { Box } from "@mui/system";
import { useState } from "react";
import { stringAvatar } from "./utils";
import axios from "axios";

interface ProfileProps {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
}

interface User {
  username: string;
  hash: string;
  favorites: Array<Object>;
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

type IndicatorsPickerProps = ProfileProps;

export default function IndicatorsPicker(props: IndicatorsPickerProps) {
  return (
    <CustomDrawer anchor="left">
      <Profile {...props} />
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
    </CustomDrawer>
  );
}

const user = {
  username: "denniskuzminer",
  hash: "String",
  favorites: ["TSLA", "AMZN", "AAPL", "GOOGL"],
  strategies: ["mongoose.Schema.Types.ObjectId"],
  backtests: ["mongoose.Schema.Types.ObjectId"],
};

function Profile(props: ProfileProps) {
  const { user, setUser } = props;
  const { username, hash, favorites, strategies, backtests } = user;
  const [formLoading, setFormLoading] = useState(false);
  const [formOpen, setFormOpen] = useState("");
  const [formData, setFormData] = useState<LoginFormDataLike>({} as LoginFormDataLike);
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

  const handleClickAway = () => {
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
    handleClickAway();
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
        handleClickAway();
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
        handleClickAway();
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
          <ClickAwayListener onClickAway={handleClickAway}>
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
          </ClickAwayListener>
        ) : (
          <ClickAwayListener onClickAway={handleClickAway}>
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
          </ClickAwayListener>
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
                <Button variant="contained" onClick={handleLogout}>
                  Logout
                </Button>
              </Card>
            ),
            Login: (
              <Card onClick={handleStopProp} className="login-popover">
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
